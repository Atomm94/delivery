import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';
import * as bcrypt from 'bcrypt';

@Entity('customer')
export class CustomerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    company_name: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: '' }) 
    ITN: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: ''  })
    owner: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: ''  })
    owner_social_number: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: ''  })
    city: string; //enum

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: ''  })
    state: string; //enum

    @IsNotEmpty()
    @Column({ type: 'integer', nullable: true  })
    cp_zip_code: number;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: ''  })
    cp_institution_name: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: ''  })
    address: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: ''  })
    cp_name: string;

    @Column({ type: 'varchar' })
    @IsPhoneNumber(null, { message: 'Invalid phone number format' })
    cp_phone_number: string;

    @Column({ default: 'default@example.com' })
    @IsEmail({}, { message: 'Invalid email address' })
    cp_email: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: ''  })
    cp_address: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false, default: ''  })
    organization_docs: string[];

    @Column({ unique: true })
    @IsPhoneNumber(null, { message: 'Invalid phone number format' })
    phone_number: string;

    @Column({ type: 'boolean', default: false })
    isVerified: boolean;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    password: string;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}
