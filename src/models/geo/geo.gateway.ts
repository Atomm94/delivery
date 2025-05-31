import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../../redis/redis.service';
import { BadRequestException } from '@nestjs/common';
import roomNameGenerator from '../../utils/roomName-generator';

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

  constructor(
    private readonly redisService: RedisService,
  ) {}

  private async handleLocationUpdate(event: string, data: any, client: Socket): Promise<void> {
    if (!data || !data.driverId || !data.location) {
      throw new BadRequestException('Invalid data: driverId and location are required.');
    }

    const redisClient = await this.redisService.getClient();
    const redisKey = data.driverId.toString();
    await redisClient.set(redisKey, JSON.stringify(data.location));

    console.log('Data saved in Redis for driver:', data.driverId);

    const room = roomNameGenerator(data.driverId);
    client.join(room);
    console.log('join room:', data.driverId);

    this.server.to(room).emit(event, data);
  }

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
    client.emit('client_connected', JSON.stringify({ message: 'Client connected successfully' }));

    client.on('disconnect', (reason) => {
      console.log(JSON.stringify(`Client disconnected: ${reason}`));
    });

    client.onAny(async (event: string, data: any) => {
      if (!event.startsWith('event:')) return;

      console.log(`Received event: ${event} with data:`, data);

      await this.handleLocationUpdate(event, data, client);
    });
  }

  handleDisconnect(client: Socket): void {
    console.log(JSON.stringify(`Client disconnected: ${client.id}`));
  }
}