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

    @Column({ unique: true })
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @Column({ unique: true })
    @IsPhoneNumber(null, { message: 'Invalid phone number format' })
    phone_number: string;

    @Column({ type: 'integer' })
    social_number: number;

    @Column({ type: 'varchar' })
    license: string[];

    @Column({ type: 'varchar' })
    selfie: string;

    @IsNotEmpty()
    @Column({ type: 'varchar' })
    state: string; //enum

    @IsNotEmpty()
    @Column({ type: 'varchar' })
    city: string; //enum

    @Column({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
    })
    coordinates: string;

    @IsNotEmpty()
    @Column({ type: 'varchar' })
    operation_state: string; //enum

    @IsNotEmpty()
    @Column({ type: 'varchar' })
    operation_cities: string[]; //enum

    @IsNotEmpty()
    @Column({ type: 'boolean' })
    porter: boolean;

    @IsNotEmpty()
    @Column({ type: 'boolean' })
    second_porter: boolean;

    @IsNotEmpty()
    @Column({ type: 'boolean' })
    third_porter: boolean;

    @IsNotEmpty()
    @Column({ type: 'boolean' })
    emergency_driver: boolean;

    @Column({ type: 'boolean' })
    isVerified: boolean;

    @IsNotEmpty()
    @Column({ type: 'varchar' })
    password: string;

    @OneToMany(() => TruckEntity, truck => truck.driver)
    trucks: TruckEntity[];
}
