import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Route } from './route.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { Address } from './address.entity';
import { Product } from './product.entity';
import { Card } from './card.entity';
import { Order } from './order.entity';

@Entity('Customer')
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    phone_number: string;

    @Column({ type: 'varchar', nullable: true })
    company_name: string;

    @Column({ type: 'varchar', nullable: true })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'jsonb', nullable: true })
    company_info: { [key: string]: any };

    @Column({ type: 'jsonb', nullable: true })
    company_address: { [key: string]: any };

    @Column({ type: 'jsonb', nullable: true })
    contact_info: { [key: string]: any };

    @Column({ type: 'simple-array', nullable: true })
    orgz_docs: string[] | null;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role: UserRole;

    @Column({ type: 'boolean', default: false })
    isVerified: boolean;

    @OneToMany(() => Order, order => order.customer, { onDelete: 'CASCADE', nullable: true })
    orders: Order[];

    @OneToMany(() => Address, (address) => address.customer, { onDelete: 'CASCADE', nullable: true })
    addresses: Address[];

    @OneToMany(() => Card, (card) => card.customer, { onDelete: 'CASCADE', nullable: true })
    cards: Card[];
}
