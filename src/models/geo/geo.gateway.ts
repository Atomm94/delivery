import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../../redis/redis.service';
import { BadRequestException } from '@nestjs/common';
import generateRoomDetails from '../../utils/generateSocketDetails';

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

    client.onAny(async (event: string, message: any) => {
      if (event === 'newEvent') {
        client.join(message.room);
      }
      if (!event.startsWith('event:')) return;
      console.log(`Received event: ${event} with data:`, message);
      const { room, data } = message;

      if (!data || !data.driverId || !data.location) {
        throw new BadRequestException('Invalid data: driverId and location are required.');
      }

      const redisClient = await this.redisService.getClient();

      const redisKey = data.driverId.toString();
      await redisClient.set(redisKey, JSON.stringify(data.location));

      console.log('Data saved in Redis for driver:', data.driverId);

      this.server.to(room).emit(event, data);
    });
  }

  handleDisconnect(client: Socket): void {
    console.log(JSON.stringify(`Client disconnected: ${client.id}`));
  }

  addDynamicEvent(driverId: number): void {
    const data = generateRoomDetails(driverId);

    console.log(`Registering dynamic event: ${data.event}`);

    this.server.emit('newEvent', data);
  }

  removeDynamicEvent(eventName: string): void {
    console.log(`Event "${eventName}" has been removed.`);
  }
}