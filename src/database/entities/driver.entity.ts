import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { Truck } from './truck.entity';
import { Load } from './load.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { Company } from './company.entity';

@Entity('Driver')
export class Driver {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true })
    phone_number: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'varchar' })
    firstName: string;

    @Column({ type: 'varchar' })
    lastName: string;

    @Column({ type: 'varchar', nullable: true })
    email: string;

    @Column({ type: 'varchar', nullable: true })
    social_number: string;

    @Column({ type: 'varchar', nullable: true })
    license: string;

    @Column({ type: 'varchar', nullable: true })
    identity: string;

    @Column({ type: 'varchar', nullable: true })
    op_state: string;

    @Column('simple-array', { nullable: true })
    op_cities: string[];

    @Column({ type: 'boolean', default: false })
    isVerified: boolean;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.COURIER,
    })
    role: UserRole;

    @Column({ type: 'boolean', default: false })
    porter: boolean;

    @Column({ type: 'boolean', default: false })
    second_porter: boolean;

    @Column({ type: 'boolean', default: false })
    third_porter: boolean;

    @Column({ type: 'boolean', default: false })
    emergency_driver: boolean;

    @OneToMany(() => Truck, truck => truck.driver)
    trucks: Truck[];

    @OneToMany(() => Load, load => load.driver)
    loads: Load[];

    @ManyToMany(() => Company, company => company.drivers)
    companies: Company[];
}

