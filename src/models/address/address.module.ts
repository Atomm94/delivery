import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../../database/entities/customer.entity';
import { Address } from '../../database/entities/address.entity';
import { RedisService } from '../../redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Customer])],
  providers: [AddressService, RedisService],
  exports: [AddressService, RedisService],
  controllers: [AddressController]
})
export class AddressModule {}
