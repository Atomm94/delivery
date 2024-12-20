import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn, ManyToOne, ManyToMany, JoinTable, Column,
} from 'typeorm';
import { Route } from './route.entity';
import { Address } from './address.entity';
import { Product } from './product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  onloading_time: string;

  price: number;

  @ManyToOne(() => Address, (address) => address.orders, { cascade: true })
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @ManyToMany(() => Product, (product) => product.orders, { cascade: true })
  @JoinTable()
  products: Product[];

  @ManyToOne(() => Route, (route) => route.orders, { cascade: true })
  @JoinColumn({ name: 'routeId' })
  route: Route;
}
