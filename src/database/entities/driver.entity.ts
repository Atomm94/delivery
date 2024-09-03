import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';
import { TruckEntity } from "./truck.entity";

@Entity('driver')
export class DriverEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    firstName: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    lastName: string;

    @Column({ default: 'default@example.com' })
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @Column({ type: 'varchar' })
    @IsPhoneNumber(null, { message: 'Invalid phone number format' })
    phone_number: string;

    @Column({ type: 'integer', nullable: true })
    social_number: number;

    @Column({ type: 'varchar', nullable: true })
    license: string[];

    @Column({ type: 'varchar', nullable: true })
    selfie: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', default: '' })
    state: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', default: '' })
    city: string;

    @Column({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
	nullable: true,
	default: 'POINT(0 0)'
    })
    coordinates: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', default: '' })
    operation_state: string; 

    @IsNotEmpty()
    @Column({ type: 'varchar', default: '' })
    operation_cities: string[];

    @IsNotEmpty()
    @Column({ type: 'boolean', default: true })
    porter: boolean;

    @IsNotEmpty()
    @Column({ type: 'boolean', default: false })
    second_porter: boolean;

    @IsNotEmpty()
    @Column({ type: 'boolean', default: false })
    third_porter: boolean;

    @IsNotEmpty()
    @Column({ type: 'boolean', default: false })
    emergency_driver: boolean;

    @Column({ type: 'boolean', default: false })
    isVerified: boolean;

    @IsNotEmpty()
    @Column({ type: 'varchar' })
    password: string;

    @OneToMany(() => TruckEntity, truck => truck.driver)
    trucks: TruckEntity[];
}
