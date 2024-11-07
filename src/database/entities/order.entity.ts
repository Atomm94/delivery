import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany, ManyToOne, JoinColumn,
} from 'typeorm';
import { Status } from '../../common/enums/route.enum';
import { Route } from './route.entity';
import { Customer } from './customer.entity';


@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  onloading_time: string;

  @Column({ type: 'varchar' })
  start_time: string;

  @Column({ type: 'varchar' })
  car_type: string;

  @Column({ type: 'varchar' })
  porter?: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.INCOMING
  })
  status: Status;

  @OneToMany(() => Route, (route) => route.order)
  routes: Route[];

  @ManyToOne(() => Customer, (customer) => customer.addresses, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'customerId' })
  customer: Customer | null;
}