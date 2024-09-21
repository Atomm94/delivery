import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import {Driver} from "../database/entities/driver.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import { IsDriverPhoneNumberUnique } from '../validators/unique.validation';

@Module({
  imports: [TypeOrmModule.forFeature([Driver]), AuthModule],
  providers: [DriversService, IsDriverPhoneNumberUnique],
  controllers: [DriversController],
  exports: [DriversService],
})
export class DriversModule {}
