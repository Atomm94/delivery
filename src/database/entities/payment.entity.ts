import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sessionId: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  paymentStatus: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  paymentMethodId: string;
}
