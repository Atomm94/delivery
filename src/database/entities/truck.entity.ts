import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { DriverEntity } from "./driver.entity";
import { CompanyEntity } from './company.entity';

@Entity('truck')
export class TruckEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: ''  })
    mark: string; //enum

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: ''  })
    model: string; //enum

    @Column({ type: 'varchar', nullable: false, default: ''  })
    date: string;

    @Column({ type: 'varchar', unique: true })
    vin_code: string;

    @Column({ type: 'varchar', nullable: false, default: ''  })
    license_plate_number: string;

    @Column({ type: 'integer', nullable: true  })
    max_capacity: number;

    @Column({ type: 'integer', nullable: true  })
    length: number;

    @Column({ type: 'integer', nullable: true  })
    width: number;

    @Column({ type: 'integer', nullable: true  })
    height: number;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: ''  })
    type: string; //enum

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: ''  })
    condition: string; //enum

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: ''  })
    vehicle_title: string[]; //photos

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: ''  })
    insurance: string[]; //photos

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: ''  })
    photos: string[]; // car photos

    @ManyToOne(() => DriverEntity, driver => driver.trucks)
    driver: DriverEntity;

    @ManyToOne(() => CompanyEntity, company => company.trucks)
    company: CompanyEntity;
}
