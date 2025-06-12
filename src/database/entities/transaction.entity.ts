import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Customer } from './customer.entity';
import { Route } from './route.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paymentId: string;

  @Column()
  amount: number; // in cents

  @Column()
  currency: string;

  @Column()
  status: string; // e.g. "paid", "pending"

  @Column()
  createdAt: Date;

  @ManyToOne(() => Customer, customer => customer.transactions)
  customer: Customer;

  @ManyToOne(() => Route, route => route.transactions)
  route: Route;
}
