import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Measure } from '../../common/enums/product.enum';
import { Route } from './route.entity';
import { Customer } from './customer.entity';

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
  })
  measure: Measure;

  @ManyToOne(() => Customer, (customer) => customer.products, { onDelete: 'CASCADE', nullable: true })
  @JoinTable({ name: 'customerId' })
  customer: Customer[];
}
