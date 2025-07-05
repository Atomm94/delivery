import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Driver } from './driver.entity';
import { Customer } from './customer.entity';

@Entity()
export class Rate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  star: number;

  @Column('simple-array')
  type: string[];

  @Column('text')
  feedback: string;

  @ManyToOne(() => Driver, driver => driver.ratings, { onDelete: 'CASCADE', nullable: true })
  driver: Driver;

  @ManyToOne(() => Customer, customer => customer.ratings, { onDelete: 'CASCADE', nullable: true })
  customer: Customer;
}
