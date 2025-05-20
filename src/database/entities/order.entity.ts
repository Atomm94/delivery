import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Route } from './route.entity';
import { Address } from './address.entity';
import { Product } from './product.entity';
import { OrderProduct } from './orderProduct.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  onloading_time: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'int', nullable: true })
  invoiceId: number;

  @Column({ type: 'varchar', nullable: true })
  verify_code: string;

  @ManyToOne(() => Address, (address) => address.orders, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, { onDelete: 'CASCADE', nullable: true })
  orderProducts: OrderProduct[];

  @ManyToOne(() => Route, (route) => route.orders, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'routeId' })
  route: Route;
}
