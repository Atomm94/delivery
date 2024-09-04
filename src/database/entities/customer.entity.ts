import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Load } from './load.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Entity('Customer')
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    person_name: string;

    @Column({ type: 'varchar', unique: true })
    person_phone_number: string;

    @Column({ type: 'varchar', nullable: true })
    person_email: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'varchar', nullable: true })
    name: string;

    @Column({ type: 'varchar', nullable: true })
    email: string;

    @Column({ type: 'varchar', nullable: true })
    ITN: string;

    @Column({ type: 'varchar', nullable: true })
    phone_number: string;

    @Column({ type: 'varchar', nullable: true })
    owner: string;

    @Column({ type: 'varchar', nullable: true })
    owner_social_number: string;

    @Column({ type: 'varchar', nullable: true })
    address: string;

    @Column({ type: 'varchar', nullable: true })
    city: string;

    @Column({ type: 'varchar', nullable: true })
    state: string;

    @Column({ type: 'int', nullable: true })
    zip_code: number;

    @Column('json', { array: true, nullable: true })
    addresses: any[];

    @Column('simple-array', { nullable: true, array: true })
    docs: string[];

    @Column({ type: 'boolean', default: false })
    isVerified: boolean;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role: UserRole;

    @OneToMany(() => Load, load => load.customer)
    loads: Load[];
}
