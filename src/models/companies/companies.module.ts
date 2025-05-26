import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Company } from '../../database/entities/company.entity';
import { Driver } from '../../database/entities/driver.entity';
import { RouteService } from '../routes/route.service';
import { Route } from '../../database/entities/route.entity';
import { OrderProduct } from '../../database/entities/orderProduct.entity';
import { Product } from '../../database/entities/product.entity';
import { Order } from '../../database/entities/order.entity';
import { Address } from '../../database/entities/address.entity';
import { Customer } from '../../database/entities/customer.entity';
import { Truck } from '../../database/entities/truck.entity';
import { RedisService } from '../../redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Driver, Route, Order, Product, OrderProduct, Address, Customer, Truck]), AuthModule],
  controllers: [CompaniesController],
  providers: [CompaniesService, RedisService, RouteService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
