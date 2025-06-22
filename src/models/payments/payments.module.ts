import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from '../../database/entities/driver.entity';
import { Card } from '../../database/entities/card.entity';
import { Transaction } from '../../database/entities/transaction.entity';
import { Customer } from '../../database/entities/customer.entity';
import { Route } from '../../database/entities/route.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Driver, Card, Transaction, Customer, Route])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
