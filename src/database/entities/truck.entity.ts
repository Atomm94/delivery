import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { DriverEntity } from "./driver.entity";
import { CompanyEntity } from './company.entity';

@Entity('truck')
export class TruckEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    mark: string; //enum

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    model: string; //enum

    @Column({ type: 'varchar', nullable: false })
    date: string;

    @Column({ type: 'varchar', unique: true })
    vin_code: string;

    @Column({ type: 'varchar', nullable: false })
    license_plate_number: string;

    @Column({ type: 'integer', nullable: false })
    max_capacity: number;

    @Column({ type: 'integer', nullable: false })
    length: number;

    @Column({ type: 'integer', nullable: false })
    width: number;

    @Column({ type: 'integer', nullable: false })
    height: number;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    type: string; //enum

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    condition: string; //enum

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    vehicle_title: string[]; //photos

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    insurance: string[]; //photos

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    photos: string[]; // car photos

    @ManyToOne(() => DriverEntity, driver => driver.trucks)
    driver: DriverEntity;

    @ManyToOne(() => CompanyEntity, company => company.trucks)
    company: CompanyEntity;
}
