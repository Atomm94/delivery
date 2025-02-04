import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../../redis/redis.service';
import { NotFoundException } from '@nestjs/common';

interface LocationData {
  driverId: string;
  location: { lat: number; lng: number };
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'], // Ensure methods are allowed
    credentials: true, // Allow credentials if necessary
    allowedHeaders: ['Content-Type'],
  },
})
export class GeoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly redisService: RedisService) {
  }


  async emitDriverLocation(driverId: number, customerId: number): Promise<void> {
    const redisClient = this.redisService.getClient();

    // Define the channel name
    const channelName = `customer:${customerId}`;
    
    const locationData = await redisClient.get(driverId.toString());

    if (!locationData) {
      // Parse location data
      throw new NotFoundException('driver location not found');
    }

    const location: any = JSON.parse(locationData);

    const emitData: any = { driverId: driverId.toString(), location };
    
    this.server.on(channelName, async (data) => {
      console.log('received data', data);

      this.server.emit(channelName, emitData);
    });
  }
  
  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);

    client.emit('client_connected', { message: 'Client connected successfully' });

    client.on('message', async (data) => {
      console.log('Message received from client:', data);

      try {
        if (!data || !data.driverId || !data.location) {
          throw new Error('Invalid data: driverId and location are required.');
        }

        const DriverId: any = data.driverId;
        const Location: any = data.location;

        const redisClient = this.redisService.getClient();
        await redisClient.set(data.driverId.toString(), JSON.stringify(data.location));

        this.server.emit('message', { driverId: DriverId, location: Location });
      } catch (error: any) {
        console.error('Error processing location:', error.message || error);
        client.emit('error', { message: 'Failed to process your request.' });
      }
    });

    client.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${reason}`);
    });

    client.on('connect_error', (err) => {
      console.error('Client connection error:', err);
    });
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, data: LocationData): Promise<void> {
    try {
      console.log('Received data:', data);

      // Ensure valid data format
      if (!data || !data.driverId || !data.location) {
        throw new Error('Invalid data: driverId and location are required.');
      }

      // Get Redis client
      const redisClient = await this.redisService.getClient();

      // Save location to Redis
      const redisKey = data.driverId.toString();
      await redisClient.set(redisKey, JSON.stringify(data.location));

      console.log('Data saved in Redis for driver:', data.driverId);

      // Emit back to the client
      client.emit('message', data);

    } catch (error: any) {
      // Log error details for better debugging
      console.error('Error processing request:', error.message || error);

      // Emit error message to the client
      client.emit('error', { message: 'Failed to process your request.' });
    }
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }
}