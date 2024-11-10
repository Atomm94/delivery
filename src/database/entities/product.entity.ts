import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Measure } from '../../common/enums/product.enum';
import { ProductType } from '../../common/enums/product-type.enum';
import { Order } from './order.entity';

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

  @ManyToMany(() => Order)
  orders: Order[];
}
