import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  last4: string;

  @Column()
  exp_month: number;

  @Column()
  exp_year: number;

  @Column()
  funding: string;

  @Column()
  country: string;

  @Column()
  name: string;

  @Column()
  stripeCustomerId: string;

  @Column()
  default: boolean;

  @Column()
  paymentMethodId: string;

  @ManyToOne(() => Customer, (customer) => customer.cards, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'customerId' })
  customer: Customer | null;
}
