import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { DriversModule } from './drivers/drivers.module';
import { CompaniesModule } from './companies/companies.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig, dataSource } from "./configs";
import {addTransactionalDataSource, initializeTransactionalContext} from 'typeorm-transactional';

import {DriverEntity} from "./database/entities/driver.entity";
import {DriversService} from "./drivers/drivers.service";
import {CustomersService} from "./customers/customers.service";
import {TruckEntity} from "./database/entities/truck.entity";
import {CustomerEntity} from "./database/entities/customer.entity";
import {CompanyEntity} from "./database/entities/company.entity";
import {LoadEntity} from "./database/entities/load.entity";

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
          DriverEntity,
          TruckEntity,
          CustomerEntity,
          CompanyEntity,
          LoadEntity,
      ]),
      CustomersModule,
      DriversModule,
      CompaniesModule,
      AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, DriversService, CustomersService],
})

export class AppModule {}
