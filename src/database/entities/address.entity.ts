import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Customer } from './customer.entity';
import { AddressType } from '../../common/enums/address-type.enum';
import { Order } from './order.entity';
import { Driver } from './driver.entity';
import { Route } from './route.entity';

@Entity('Address')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar'})
  institution_name: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar' })
  state: string;

  @Column({ type: 'varchar' })
  zip_code: string;

  @Column({ type: 'boolean', default: false })
  main: boolean;

  @Column({
    type: 'enum',
    enum: AddressType,
    default: AddressType.LOAD,
  })
  type: AddressType;

  @Column({ type: 'varchar', nullable: true })
  contact_person: string | null;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column('geometry', {
    nullable: true,
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: any;


  @OneToMany(() => Order, (order) => order.address)
  orders: Order[];

  @ManyToOne(() => Customer, (customer) => customer.addresses, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'customerId' })
  customer: Customer | null;

  @ManyToOne(() => Driver, (driver) => driver.addresses, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'driverId' })
  driver: Driver | null;
}

