import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../../redis/redis.service';
import { BadRequestException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type'],
  },
})
export class GeoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly redisService: RedisService) {}

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
    client.emit('client_connected', JSON.stringify({ message: 'Client connected successfully' }));

    client.on('disconnect', (reason) => {
      console.log(JSON.stringify(`Client disconnected: ${reason}`));
    });

    client.onAny(async (event: string, data: any) => {
      console.log(`Received event: ${event} with data:`, data);

      if (!data || !data.driverId || !data.location) {
        throw new BadRequestException('Invalid data: driverId and location are required.');
      }

      const redisClient = await this.redisService.getClient();

      const redisKey = data.driverId.toString();
      await redisClient.set(redisKey, JSON.stringify(data.location));

      console.log('Data saved in Redis for driver:', data.driverId);

      client.emit(event, data);
    });
  }

  handleDisconnect(client: Socket): void {
    console.log(JSON.stringify(`Client disconnected: ${client.id}`));
  }

  addDynamicEvent(eventName: string, handler: (client: Socket, data: any) => void): void {
    console.log(`Registering dynamic event: ${eventName}`);

    this.server.sockets.on(eventName, (data) => {
      handler;
    });
  }


  removeDynamicEvent(eventName: string): void {
    console.log(`Event "${eventName}" has been removed.`);
  }
}