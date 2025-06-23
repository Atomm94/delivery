import { Module, forwardRef } from '@nestjs/common';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../../database/entities/customer.entity';
import { Route } from '../../database/entities/route.entity';
import { Order } from '../../database/entities/order.entity';
import { Product } from '../../database/entities/product.entity';
import { Address } from '../../database/entities/address.entity';
import { OrderProduct } from '../../database/entities/orderProduct.entity';
import { RedisService } from '../../redis/redis.service';
import { Driver } from '../../database/entities/driver.entity';
import { Truck } from '../../database/entities/truck.entity';
import { Company } from '../../database/entities/company.entity';
import { DriversModule } from '../drivers/drivers.module';
import { CompaniesModule } from '../companies/companies.module';
import { CronService } from '../../cron/cron.service';
import { UserToken } from '../../database/entities/user-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Route, Customer, Company, Order, Product, Address, OrderProduct, Driver, Truck, UserToken]),
    forwardRef(() => DriversModule),
    forwardRef(() => CompaniesModule),
  ],
  providers: [RouteService, RedisService, CronService],
  exports: [RouteService, CronService],
  controllers: [RouteController]
})
export class RouteModule {}

