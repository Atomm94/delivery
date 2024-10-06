import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from '../database/entities/driver.entity';
import { Card } from '../database/entities/card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, Driver])],
  providers: [CardsService],
  controllers: [CardsController],
  exports: [CardsService],
})
export class CardsModule {}
