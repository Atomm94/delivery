import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('load')
export class LoadEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: '' })
    state: string; //enum

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: ''  })
    city: string; //enum

    @Column({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
	nullable: true,
	default: 'POINT(0 0)'
    })
    coordinates: string;

    @IsNotEmpty()
    @Column({ type: 'integer', nullable: true  })
    zip_code: number;

    @IsNotEmpty()
    @Column({ type: 'integer', nullable: true  })
    price: number;

    @IsNotEmpty()
    @Column({ type: 'integer', nullable: true  })
    width: number;

    @IsNotEmpty()
    @Column({ type: 'integer', nullable: true  })
    length: number;

    @IsNotEmpty()
    @Column({ type: 'integer', nullable: true  })
    height: number;
}
