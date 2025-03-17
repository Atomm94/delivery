import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('CompanyDriver')
export class CompanyDriver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  companyId: number;

  @Column({ type: 'varchar', unique: true })
  phone_number: string;
}

