import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody
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

  private async handleLocationUpdate(event: string, message: any, client: Socket): Promise<void> {
    const { room, data } = message;
    if (!data || !data.driverId || !data.location) {
      throw new BadRequestException('Invalid data: driverId and location are required.');
    }

    const redisClient = await this.redisService.getClient();
    const redisKey = `${client.id}`;
    await redisClient.set(redisKey, JSON.stringify(data));

    console.log('Data saved in Redis for driver:', data.driverId);

    this.server.to(room).emit(event, data);
  }

  @SubscribeMessage('room')
  handleJoinRoom(
    @MessageBody() driverId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const room = roomNameGenerator(driverId);
    client.join(room);
    console.log('join room:', driverId);
    this.server.to(room).emit('room', 'you are connected to room: ' + room + '');
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

  async handleDisconnect(client: Socket) {
    const redisClient = await this.redisService.getClient();
    const redisKey = `${client.id}`;
    await redisClient.del(redisKey);
    console.log(JSON.stringify(`Client disconnected: ${client.id}`));
  }
}