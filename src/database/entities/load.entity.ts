import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('load')
export class LoadEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    state: string; //enum

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    city: string; //enum

    @Column({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
    })
    coordinates: string;

    @IsNotEmpty()
    @Column({ type: 'integer', nullable: false })
    zip_code: number;

    @IsNotEmpty()
    @Column({ type: 'integer', nullable: false })
    price: number;

    @IsNotEmpty()
    @Column({ type: 'integer', nullable: false })
    width: number;

    @IsNotEmpty()
    @Column({ type: 'integer', nullable: false })
    length: number;

    @IsNotEmpty()
    @Column({ type: 'integer', nullable: false })
    height: number;
}
