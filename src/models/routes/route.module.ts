import { Module } from '@nestjs/common';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../../database/entities/customer.entity';
import { Route } from '../../database/entities/route.entity';
import { Order } from '../../database/entities/order.entity';
import { Product } from '../../database/entities/product.entity';
import { Address } from '../../database/entities/address.entity';
import { OrderProduct } from '../../database/entities/orderProduct.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Route, Customer, Order, Product, Address, OrderProduct])],
  providers: [RouteService],
  controllers: [RouteController]
})
export class RouteModule {}

