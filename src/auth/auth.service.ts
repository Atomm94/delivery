import { Injectable } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { SignInDto } from '../common/DTOs/auth.dto';
import { UserRole } from '../common/enums/user-role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from '../database/entities/driver.entity';
import { Company } from '../database/entities/company.entity';
import { Customer } from '../database/entities/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
      @InjectRepository(Driver)
      private readonly driverRepository: Repository<Driver>,
      @InjectRepository(Customer)
      private readonly customerRepository: Repository<Customer>,
      @InjectRepository(Company)
      private readonly companyRepository: Repository<Company>,
    ) {}

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, newPassword: string): Promise<boolean> {
        return bcrypt.compare(newPassword, password);
    }

    async signIn(body: SignInDto): Promise<SignInDto> {
        const { role, phone_number, password } = body;
        let user;

        switch (role) {
            case UserRole.COURIER:
                user = await this.driverRepository.findOneBy({ phone_number });
                break;
            case UserRole.COMPANY:
                user = await this.companyRepository.findOneBy({ phone_number });
                break;
            case UserRole.CUSTOMER:
                user = await this.customerRepository.findOneBy({ phone_number });
                break;
        }

        const match = await this.comparePassword(user.password, password);

        if (!match) {
            throw 'passwords do not match';
        }

        return user;
    }
}
