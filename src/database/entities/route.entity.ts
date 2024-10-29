import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { Customer } from './customer.entity';
import { Driver } from './driver.entity';
import { Status } from '../../common/enums/route.enum';
import { Product } from './product.entity';


@Entity()
export class Route {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    onloading_time: string;

    @Column({ type: 'varchar' })
    start_time: string;

    @Column({ type: 'varchar' })
    car_type: string;

    @Column({ type: 'varchar' })
    porter?: string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.INCOMING
    })
    status: Status;

    @ManyToMany(() => Address, (address) => address.routes, { onDelete: 'CASCADE', nullable: true })
    @JoinTable({ name: 'addresses' })
    addresses: Address[];

    @Column('jsonb')
    items: {
        name: string;
        count: number;
        price: number;
        weight: number;
        length: number;
        width: number;
        height: number;
        measure?: string;
    }

    @ManyToOne(() => Customer, customer => customer.routes, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'customerId' })
    customer: Customer;

    @ManyToOne(() => Driver, driver => driver.routes, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'driverId' })
    driver: Driver;
}