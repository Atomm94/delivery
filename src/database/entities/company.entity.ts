import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { Truck } from './truck.entity';
import { Driver } from './driver.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { Address } from './address.entity';

@Entity('Company')
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true })
    phone_number: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar', nullable: true })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'varchar', nullable: true  })
    ITN: string;

    @Column({ type: 'varchar', nullable: true  })
    owner: string;

    @Column({ type: 'varchar', nullable: true })
    owner_social_number: string;

    @Column({ type: 'varchar', nullable: true  })
    address: string;

    @Column({ type: 'varchar', nullable: true  })
    city: string;

    @Column({ type: 'varchar', nullable: true  })
    state: string;

    @Column({ type: 'varchar', nullable: true  })
    zip_code: string;

    @Column({ type: 'varchar', nullable: true  })
    op_state: string;

    @Column({ type: 'varchar', nullable: true  })
    op_city: string;

    @Column({
        type: 'jsonb',
        nullable: true,
        default: () => "'{}'",
        transformer: {
            from: (value: any) => (value ? (typeof value === 'string' ? JSON.parse(value) : value) : null),
            to: (value: any) => value,
        },
    })
    contact_person_info: { [key: string]: any } = {};

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

    @OneToMany(() => Driver, driver => driver.company)
    drivers: Driver[];

    @OneToMany(() => Address, (address) => address.driver, { onDelete: 'CASCADE', nullable: true })
    addresses: Address[];
}