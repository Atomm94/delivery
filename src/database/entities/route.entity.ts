import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany, ManyToOne, JoinColumn,
} from 'typeorm';
import { Status, PaymentStatus, Porter } from '../../common/enums/route.enum';
import { Order } from './order.entity';
import { Customer } from './customer.entity';
import { Driver } from './driver.entity';

@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  start_time: string;

  @Column({ type: 'varchar', nullable: true })
  car_type: string;

  @Column({
    type: 'enum',
    enum: Porter,
    default: Porter['Without porter']
  })
  porter: Porter;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.NOT_PAYED,
  })
  payment: PaymentStatus;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.INCOMING,
  })
  status: Status;

  price: number;

  @OneToMany(() => Order, (order) => order.route)
  orders: Order[];

  @ManyToOne(() => Customer, (customer) => customer.addresses, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'customerId' })
  customer: Customer | null;

  @ManyToOne(() => Driver, (driver) => driver.addresses, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'driverId' })
  driver: Driver | null;
}