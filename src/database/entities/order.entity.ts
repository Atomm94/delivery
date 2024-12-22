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

  @ManyToOne(() => Address, (address) => address.orders, { cascade: true })
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  orderProducts: OrderProduct[];

  @ManyToOne(() => Route, (route) => route.orders, { cascade: true })
  @JoinColumn({ name: 'routeId' })
  route: Route;
}
