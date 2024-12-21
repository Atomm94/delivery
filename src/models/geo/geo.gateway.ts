import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../../redis/redis.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GeoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly redisService: RedisService) {}

  async handleConnection(client: Socket): Promise<void> {
    console.log(`Client connected: ${client.id}`);
    client.on('message', async (data) => {
      try {
        const redisClient = await this.redisService.getClient();
        await redisClient.set(data.driverId, JSON.stringify(data.location));
      } catch (error) {
        console.error('Error setting location in Redis:', error);
      }
    });
    client.emit('message', 'ok');
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }
}