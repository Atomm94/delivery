import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Measure } from '../../common/enums/product.enum';
import { ProductType } from '../../common/enums/product-type.enum';
import { Order } from './order.entity';
import { Customer } from './customer.entity';
import { OrderProduct } from './orderProduct.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('float')
  weight: number;

  @Column('float')
  length: number;

  @Column('float')
  width: number;

  @Column('float')
  height: number;

  @Column({
    type: 'enum',
    enum: Measure,
    nullable: true,
    default: null,
  })
  measure: Measure | null;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.BOX,
  })
  type: ProductType;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product, { onDelete: 'CASCADE', nullable: true })
  orderProducts: OrderProduct[];

  @ManyToOne(() => Customer, (customer) => customer.products, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'customerId' })
  customer: Customer | null;
}
