import { Module } from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { TrucksController } from './trucks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Truck } from '../../database/entities/truck.entity';
import { Driver } from '../../database/entities/driver.entity';
import { Company } from '../../database/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Truck, Driver, Company]), AuthModule],
  providers: [TrucksService],
  controllers: [TrucksController],
  exports: [TrucksService],
})
export class TrucksModule {}
