import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Driver } from './driver.entity';

@Entity('Card')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  card_number: string;

  @Column({ type: 'varchar' })
  card_date: string;

  @Column({ type: 'varchar' })
  card_cvv: string;

  @ManyToOne(() => Driver, (driver) => driver.cards, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'driverId' })
  driver: Driver | null;
}

