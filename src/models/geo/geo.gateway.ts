import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../../redis/redis.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/socket',
})
export class GeoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly redisService: RedisService) {
  }

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, data: any): Promise<void> {
    try {
      const redisClient = await this.redisService.getClient();
      await redisClient.set(data.driverId, JSON.stringify(data.location));
      client.emit('message', data);
    } catch (error) {
      console.error('Error setting location in Redis:', error);
    }
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }
}