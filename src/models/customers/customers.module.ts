import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Customer } from '../../database/entities/customer.entity';
import { Address } from '../../database/entities/address.entity';
import { Contact } from '../../database/entities/contact.entity';
import { Rate } from '../../database/entities/rate.entity';
import { Driver } from '../../database/entities/driver.entity';
import { Route } from '../../database/entities/route.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Address, Contact, Rate, Driver, Route]), AuthModule],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
