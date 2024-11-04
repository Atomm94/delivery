import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from '../database/entities/route.entity';
import { Customer } from '../database/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Route, Customer])],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
