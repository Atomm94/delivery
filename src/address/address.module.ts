import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../database/entities/customer.entity';
import { Address } from '../database/entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Customer])],
  providers: [AddressService],
  controllers: [AddressController]
})
export class AddressModule {}
