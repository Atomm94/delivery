import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderProducts, { cascade: true, onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderProducts, { cascade: true, onDelete: 'CASCADE' })
  product: Product;

  @Column('float')
  count: number;

  @Column('float')
  price: number;
}
