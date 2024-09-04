import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { Truck } from './truck.entity';
import { Driver } from './driver.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Entity('Company')
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true })
    phone_number: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column('simple-array', { nullable: true, array: true })
    license: string[];

    @Column({ type: 'boolean', default: false })
    isVerified: boolean;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.COMPANY,
    })
    role: UserRole;

    @OneToMany(() => Truck, truck => truck.company)
    trucks: Truck[];

    @ManyToMany(() => Driver, driver => driver.companies)
    drivers: Driver[];
}