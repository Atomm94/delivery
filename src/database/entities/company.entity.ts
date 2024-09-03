import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsPhoneNumber } from 'class-validator';
import { TruckEntity } from "./truck.entity";

@Entity('company')
export class CompanyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    @IsPhoneNumber(null, { message: 'Invalid phone number format' })
    phone_number: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', nullable: false })
    license: string[];

    @Column({ type: 'boolean', default: false })
    isVerified: boolean;

    @OneToMany(() => TruckEntity, truck => truck.company)
    trucks: TruckEntity[];
}
