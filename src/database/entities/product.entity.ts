import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Measure } from '../../common/enums/product.enum';
import { ProductType } from '../../common/enums/product-type.enum';
import { Route } from './route.entity';

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

  @OneToMany(() => Route, (route) => route.product)
  routes: Route[];
}
