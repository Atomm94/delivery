import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from './database/entities/driver.entity';
import { Repository } from 'typeorm';
import { Customer } from './database/entities/customer.entity';
import { Company } from './database/entities/company.entity';
import { UserRole } from './common/enums/user-role.enum';
import { AuthUserData } from './common/interfaces/common.interface';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async getUserData(user: AuthUserData): Promise<any> {
    const { role, phone_number } = user;

    switch (role) {
      case UserRole.COURIER:
        return await this.driverRepository.findOne({
          where: { phone_number },
          relations: ['trucks']
        });
      case UserRole.COMPANY:
        return await this.companyRepository.findOneBy({ phone_number });
      case UserRole.CUSTOMER:
        return await this.customerRepository.findOne({ where: { phone_number }, relations: ['addresses'] });
    }
  }

  async deleteUserData(user: AuthUserData): Promise<any> {
    const { role, phone_number } = user;

    switch (role) {
      case UserRole.COURIER:
        return await this.driverRepository.delete({ phone_number });
      case UserRole.COMPANY:
        return await this.companyRepository.delete({ phone_number });
      case UserRole.CUSTOMER:
        return await this.customerRepository.delete({ phone_number });
    }
  }
}
