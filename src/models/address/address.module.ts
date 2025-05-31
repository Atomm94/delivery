import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../../database/entities/customer.entity';
import { Address } from '../../database/entities/address.entity';
import { RedisService } from '../../redis/redis.service';
import { Driver } from '../../database/entities/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Customer, Driver])],
  providers: [AddressService, RedisService],
  exports: [AddressService, RedisService],
  controllers: [AddressController]
})
export class AddressModule {}
