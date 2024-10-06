import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { DriversModule } from './drivers/drivers.module';
import { CompaniesModule } from './companies/companies.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig, dataSource, multerConfig } from './configs';
import {addTransactionalDataSource, initializeTransactionalContext} from 'typeorm-transactional';

import { Driver } from './database/entities/driver.entity';
import {DriversService} from "./drivers/drivers.service";
import {CustomersService} from "./customers/customers.service";
import { Truck } from './database/entities/truck.entity';
import { Customer } from './database/entities/customer.entity';
import { Company } from './database/entities/company.entity';
import { Load } from './database/entities/load.entity';
import { JwtMiddleware } from './auth/jwt/jwt.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { FilesInterceptor } from './interceptors/files.interceptor';
import { TrucksModule } from './trucks/trucks.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CardsModule } from './cards/cards.module';
import { Card } from './database/entities/card.entity';


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
          Load,
          Card
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
      CardsModule
  ],
  controllers: [AppController],
  providers: [AppService, DriversService, CustomersService, FilesInterceptor],
})

export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware)
          .forRoutes(AppController);
    }
}
