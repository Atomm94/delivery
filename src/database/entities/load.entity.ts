import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Customer } from './customer.entity';
import { Driver } from './driver.entity';

@Entity('Load')
export class Load {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    state: string;

    @Column({ type: 'varchar' })
    city: string;

    @Column({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    })
    coordinates: string;

    @Column('int')
    zip_code: number;

    @Column('int')
    price: number;

    @Column('int')
    width: number;

    @Column('int')
    length: number;

    @Column('int')
    height: number;

    @ManyToOne(() => Customer, customer => customer.loads)
    customer: Customer;

    @ManyToOne(() => Driver, driver => driver.loads)
    driver: Driver;
}
