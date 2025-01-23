import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentStatus, Porter, Status } from '../../common/enums/route.enum';
import { Order } from './order.entity';
import { Customer } from './customer.entity';
import { Driver } from './driver.entity';
import { Address } from './address.entity';
import { Truck } from './truck.entity';

@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz', nullable: true })
  start_time: Date;

  @Column({ type: 'varchar', nullable: true })
  car_type: string;

  @Column({
    default: Porter['1']
  })
  porter: string;

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

  @Column({ type: 'float', nullable: true })
  price: number;

  @Column({ type: 'int', nullable: true })
  invoiceId: number;

  @Column("int", { array: true, nullable: true })
  loadAddresses: number[];

  @OneToMany(() => Order, (order) => order.route, { onDelete: 'CASCADE', nullable: true })
  orders: Order[];

  @ManyToOne(() => Customer, (customer) => customer.routes, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'customerId' })
  customer: Customer | null;

  @ManyToOne(() => Truck, (truck) => truck.routes, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'truckId' })
  truck: Truck | null;
}