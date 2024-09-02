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
    @Column({ type: 'varchar', nullable: false })
    ITN: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    owner: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    owner_social_number: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    city: string; //enum

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    state: string; //enum

    @IsNotEmpty()
    @Column({ type: 'integer', nullable: false })
    cp_zip_code: number;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    cp_institution_name: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    address: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    cp_name: string;

    @Column({ unique: true })
    @IsPhoneNumber(null, { message: 'Invalid phone number format' })
    cp_phone_number: string;

    @Column({ unique: true })
    @IsEmail({}, { message: 'Invalid email address' })
    cp_email: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
    cp_address: string;

    @IsNotEmpty()
    @Column({ type: 'varchar', nullable: false })
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
