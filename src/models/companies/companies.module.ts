import { Module, forwardRef } from '@nestjs/common';
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
import { DriversService } from '../drivers/drivers.service';
import { GeoGateway } from '../geo/geo.gateway';
import { RouteModule } from '../routes/route.module';
import { UserToken } from '../../database/entities/user-token.entity';
import { PaymentsService } from '../payments/payments.service';
import { Transaction } from '../../database/entities/transaction.entity';
import { Card } from '../../database/entities/card.entity';
import { Rate } from '../../database/entities/rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Driver, Route, Order, Product, OrderProduct, Address, Customer, Truck, UserToken, Transaction, Card, Rate]),
    AuthModule,
    forwardRef(() => RouteModule)
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, DriversService, RedisService, RouteService, GeoGateway, Company, PaymentsService],
  exports: [CompaniesService, Company],
})
export class CompaniesModule {
}