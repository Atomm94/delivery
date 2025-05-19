import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './models/customers/customers.module';
import { DriversModule } from './models/drivers/drivers.module';
import { CompaniesModule } from './models/companies/companies.module';
import { AuthModule } from './models/auth/auth.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig, dataSource, multerConfig } from './configs';
import {addTransactionalDataSource, initializeTransactionalContext} from 'typeorm-transactional';

import { Driver } from './database/entities/driver.entity';
import {DriversService} from "./models/drivers/drivers.service";
import {CustomersService} from "./models/customers/customers.service";
import { Truck } from './database/entities/truck.entity';
import { Customer } from './database/entities/customer.entity';
import { Company } from './database/entities/company.entity';
import { JwtMiddleware } from './models/auth/jwt/jwt.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { FilesInterceptor } from './interceptors/files.interceptor';
import { TrucksModule } from './models/trucks/trucks.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PaymentsModule } from './models/payments/payments.module';
import { Address } from './database/entities/address.entity';
import { Card } from './database/entities/card.entity';
import { ProductsModule } from './models/products/products.module';
import { AddressModule } from './models/address/address.module';
import { RouteModule } from './models/routes/route.module';
import { Route } from './database/entities/route.entity';
import { GeoGateway } from './models/geo/geo.gateway';
import { GeoModule } from './models/geo/geo.module';
import { RedisModule } from './redis/redis.module';
import { Contact } from './database/entities/contact.entity';
import { Rate } from './database/entities/rate.entity';
import { CompanyDriver } from './database/entities/company-driver.entity';
import { CompaniesService } from './models/companies/companies.service';
import { Order } from './database/entities/order.entity';


initializeTransactionalContext();

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
          load: [databaseConfig],
      }),
      TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => configService.get('database'),
          dataSourceFactory: async () => addTransactionalDataSource(dataSource),
      }),
      TypeOrmModule.forFeature([
          Driver,
          Truck,
          Customer,
          Company,
          CompanyDriver,
          Route,
          Card,
          Address,
          Contact,
          Rate,
          Order
      ]),
      MulterModule.register(multerConfig),
      ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', 'uploads'),
      }),
      CustomersModule,
      DriversModule,
      CompaniesModule,
      AuthModule,
      TrucksModule,
      PaymentsModule,
      RedisModule,
      GeoModule,
      ProductsModule,
      AddressModule,
      RouteModule,
  ],
  controllers: [AppController],
  providers: [AppService, DriversService, CustomersService, CompaniesService, FilesInterceptor, GeoGateway],
})

export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware)
          .forRoutes(AppController);
    }
}
