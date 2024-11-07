import { Module } from '@nestjs/common';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../database/entities/customer.entity';
import { Route } from '../database/entities/route.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Route, Customer])],
  providers: [RouteService],
  controllers: [RouteController]
})
export class RouteModule {}

