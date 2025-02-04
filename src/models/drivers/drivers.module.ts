import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import {Driver} from "../../database/entities/driver.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import { IsDriverPhoneNumberUnique } from '../../validators/unique.validation';
import { Route } from '../../database/entities/route.entity';
import { Rate } from '../../database/entities/rate.entity';
import { Truck } from '../../database/entities/truck.entity';
import { GeoModule } from '../geo/geo.module';
import { GeoGateway } from '../geo/geo.gateway';
import { RedisService } from '../../redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Driver, Route, Rate, Truck]), AuthModule, GeoModule],
  providers: [DriversService, IsDriverPhoneNumberUnique, GeoGateway, RedisService],
  controllers: [DriversController],
  exports: [DriversService],
})
export class DriversModule {}
