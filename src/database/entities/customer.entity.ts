import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';
import { Address } from './address.entity';
import { Card } from './card.entity';
import { Route } from './route.entity';
import { Product } from './product.entity';
import { Contact } from './contact.entity';
import { Transaction } from './transaction.entity';
import { Rate } from './rate.entity';

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

    @Column({
        type: 'jsonb',
        nullable: true,
        default: () => "'{}'",
        transformer: {
            from: (value: any) => (value ? (typeof value === 'string' ? JSON.parse(value) : value) : null),
            to: (value: any) => value,
        },
    })
    company_info: { [key: string]: any } = {};


    @Column({
        type: 'jsonb',
        nullable: true,
        default: () => "'{}'",
        transformer: {
            from: (value: any) => (value ? (typeof value === 'string' ? JSON.parse(value) : value) : null),
            to: (value: any) => value,
        },
    })
    company_address: { [key: string]: any } = {};

    @Column({
        type: 'jsonb',
        nullable: true,
        default: () => "'{}'",
        transformer: {
            from: (value: any) => (value ? (typeof value === 'string' ? JSON.parse(value) : value) : null),
            to: (value: any) => value,
        },
    })
    contact_info: { [key: string]: any } = {};

    @Column({ type: 'simple-array', nullable: true })
    orgz_docs: string[];

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role: UserRole;

    @Column({ type: 'boolean', default: false })
    isVerified: boolean;

    @OneToMany(() => Route, route => route.customer, { onDelete: 'CASCADE', nullable: true })
    routes: Route[];

    @OneToMany(() => Transaction, transaction => transaction.customer)
    transactions: Transaction[];

    @OneToMany(() => Address, (address) => address.customer, { onDelete: 'CASCADE', nullable: true })
    addresses: Address[];

    @OneToMany(() => Product, (product) => product.customer, { onDelete: 'CASCADE', nullable: true })
    products: Product[];

    @OneToMany(() => Card, (card) => card.customer, { onDelete: 'CASCADE', nullable: true })
    cards: Card[];

    @OneToMany(() => Contact, (contact) => contact.customer, { onDelete: 'CASCADE' })
    contacts: Contact[];

    @OneToMany(() => Rate, rate => rate.driver, { onDelete: 'CASCADE', nullable: true })
    ratings: Rate[];
}
