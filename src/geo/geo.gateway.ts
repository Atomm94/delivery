import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../redis/redis.service';

@WebSocketGateway()
export class GeoGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly redisService: RedisService) {}

  @SubscribeMessage('addLocation')
  async handleAddLocation(client: Socket, data: { name: string; latitude: number; longitude: number }) {
    const clientRedis = this.redisService.getClient();
    await clientRedis.geoadd('locations', data.longitude, data.latitude, data.name);
    this.server.emit('locationAdded', data);
  }

  @SubscribeMessage('findNearby')
  async handleFindNearby(client: Socket, data: { latitude: number; longitude: number; radius: number }) {
    const clientRedis = this.redisService.getClient();
    const results = await clientRedis.georadius('locations', data.longitude, data.latitude, data.radius, 'km');
    client.emit('nearbyLocations', results);
  }
}
