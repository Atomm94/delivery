import { Module } from '@nestjs/common';
import { RedisModule } from '../../redis/redis.module';
import { GeoGateway } from './geo.gateway';

@Module({
  imports: [RedisModule],
  providers: [GeoGateway],
})
export class GeoModule {}