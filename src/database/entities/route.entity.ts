import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn, ManyToOne, OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { Address } from './address.entity';
import { Order } from './order.entity';

@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Address, (address) => address.routes, { cascade: true })
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @ManyToOne(() => Product, (product) => product.routes, { cascade: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Order, (order) => order.routes, { cascade: true })
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
