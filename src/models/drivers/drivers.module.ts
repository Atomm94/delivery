import { Module, forwardRef } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { Driver } from '../../database/entities/driver.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { IsDriverPhoneNumberUnique } from '../../validators/unique.validation';
import { Route } from '../../database/entities/route.entity';
import { Order } from '../../database/entities/order.entity';
import { Rate } from '../../database/entities/rate.entity';
import { Truck } from '../../database/entities/truck.entity';
import { GeoModule } from '../geo/geo.module';
import { GeoGateway } from '../geo/geo.gateway';
import { RedisService } from '../../redis/redis.service';
import { RouteService } from '../routes/route.service';
import { Product } from '../../database/entities/product.entity';
import { OrderProduct } from '../../database/entities/orderProduct.entity';
import { Address } from '../../database/entities/address.entity';
import { Customer } from '../../database/entities/customer.entity';
import { CompaniesService } from '../companies/companies.service';
import { RouteModule } from '../routes/route.module';
import { Company } from '../../database/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Driver, Route, Rate, Truck, Order, Product, OrderProduct, Address, Customer, Company]),
    forwardRef(() => RouteModule),
    AuthModule,
    GeoModule,
  ],
  providers: [DriversService, CompaniesService, IsDriverPhoneNumberUnique, GeoGateway, RedisService, RouteService, Driver],
  controllers: [DriversController],
  exports: [DriversService, Driver],
})
export class DriversModule {
}