import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Company } from './company.entity';
import { Driver } from './driver.entity';
import { TruckCondition } from '../../common/enums/truck-condition.enum';
import { Route } from './route.entity';

@Entity('Truck')
export class Truck {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    mark: string | null;

    @Column({ type: 'varchar', nullable: true })
    model: string | null;

    @Column({ type: 'varchar', nullable: true })
    year: string | null;

    @Column({ type: 'varchar', nullable: true })
    vin_code: string | null;

    @Column({ type: 'varchar', nullable: true })
    license_plate_number: string | null;

    @Column('int', { nullable: true })
    max_capacity: number | null;

    @Column('int', { nullable: true })
    length: number | null;

    @Column('int', { nullable: true })
    width: number | null;

    @Column('int', { nullable: true })
    height: number | null;

    @Column({ type: 'varchar', nullable: true })
    type: string | null;

    @Column({
        type: 'enum',
        enum: TruckCondition,
        nullable: true,
    })
    condition: TruckCondition | null;

    @Column('simple-array', { nullable: true })
    vehicle_title: string[] | null;

    @Column('simple-array', { nullable: true })
    insurance_photos: string[] | null;

    @Column('simple-array', { nullable: true })
    insurance_files: string[] | null;

    @Column('simple-array', { nullable: true })
    photos: string[] | null;

    @ManyToOne(() => Driver, driver => driver.trucks, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'driverId' })
    driver: Driver | null;

    @ManyToOne(() => Company, company => company.trucks, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'companyId' })
    company: Company | null;

    @OneToMany(() => Route, route => route.truck, { onDelete: 'CASCADE', nullable: true })
    routes: Route[];
}
