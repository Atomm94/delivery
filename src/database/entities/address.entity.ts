import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { Customer } from './customer.entity';
import { AddressType } from '../../common/enums/address-type.enum';
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

  @OneToMany(() => Route, (route) => route.address)
  routes: Route[];

  @ManyToOne(() => Customer, (customer) => customer.addresses, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'customerId' })
  customer: Customer | null;
}

