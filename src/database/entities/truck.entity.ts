import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Company } from './company.entity';
import { Driver } from './driver.entity';
import { TruckCondition } from '../../common/enums/truck-condition.enum';

@Entity('Truck')
export class Truck {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    mark: string;

    @Column({ type: 'varchar' })
    model: string;

    @Column({ type: 'varchar' })
    year: string;

    @Column({ type: 'varchar' })
    vin_code: string;

    @Column({ type: 'varchar' })
    license_plate_number: string;

    @Column('int')
    max_capacity: number;

    @Column('int')
    length: number;

    @Column('int')
    width: number;

    @Column('int')
    height: number;

    @Column({ type: 'varchar' })
    type: string;

    @Column({
        type: 'enum',
        enum: TruckCondition,
    })
    condition: TruckCondition;

    @Column('simple-array', { array: true })
    vehicle_title: string[];

    @Column('simple-array', { array: true })
    insurances: string[];

    @Column('simple-array', { array: true })
    photos: string[];

    @Column({ type: 'boolean', default: false })
    porter: boolean;

    @Column({ type: 'boolean', default: false })
    second_porter: boolean;

    @Column({ type: 'boolean', default: false })
    third_porter: boolean;

    @Column({ type: 'boolean', default: false })
    emergency_driver: boolean;

    @ManyToOne(() => Driver, driver => driver.trucks)
    driver: Driver;

    @ManyToOne(() => Company, company => company.trucks)
    company: Company;
}
