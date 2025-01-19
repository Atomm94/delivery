import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Driver } from './driver.entity';

@Entity()
export class Rate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  star: number;

  @Column('varchar')
  type: string;

  @Column('text')
  criteria: string;

  @ManyToOne(() => Driver, driver => driver.ratings, { onDelete: 'CASCADE', nullable: true })
  driver: Driver;
}
