import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from './database/entities/driver.entity';
import { Repository } from 'typeorm';
import { Customer } from './database/entities/customer.entity';
import { Company } from './database/entities/company.entity';
import { UserRole } from './common/enums/user-role.enum';
import { GetUserData } from './common/interfaces/common.interface';

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

  async getUserData(user: GetUserData): Promise<any> {
    const { role, phone_number } = user;

    switch (role) {
      case UserRole.COURIER:
        return await this.driverRepository.findOneBy({ phone_number });
      case UserRole.COMPANY:
        return await this.companyRepository.findOneBy({ phone_number });
      case UserRole.CUSTOMER:
        return await this.customerRepository.findOneBy({ phone_number });
    }
  }
}
