import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CompanyMultipleDriverDto, CompleteCompanyDataDto, UpdateCompanyDataDto, CompanySignUpDto } from '../../common/DTOs/company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../../database/entities/company.entity';
import { AuthService } from '../auth/auth.service';
import { Driver } from '../../database/entities/driver.entity';
import {
  completeDtoToPartialCompanyEntity,
  updateDtoToPartialCompanyEntity,
} from '../../common/helpers/dtoToPartialEntity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    private readonly authService: AuthService,
  ) {}

  async get(condition: any): Promise<Company> {
    return await this.companyRepository.findOne({ where: condition });
  }

  async getAll(condition: any): Promise<Company[]> {
    return await this.companyRepository.find({ where: condition });
  }

  async createCompanyDrivers(companyId: number, data: CompanyMultipleDriverDto): Promise<Driver[]> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('company user is not found');
    }

    // Check if any driver phone number already exists
    for (const driverData of data.drivers) {
      const existingDriver = await this.driverRepository.findOne({
        where: { phone_number: driverData.phone_number },
      });

      if (existingDriver) {
        throw new ConflictException(
          `Driver with phone number ${driverData.phone_number} already exists`,
        );
      }
    }

    // Generate passwords for each driver, save hashed, return plaintext passwords
    const saveDriversData = [] as any[];
    const originalPasswords: string[] = [];
    for await (const driverData of data.drivers) {
      const generated = this.generatePassword();
      originalPasswords.push(generated);
      const hashed = await this.authService.hashPassword(generated);
      const {
        /* ensure any provided password is ignored */ password: _ignored,
        ...rest
      } = driverData as any;
      saveDriversData.push({
        ...rest,
        password: hashed,
        company: companyId,
      });
    }

    const saved = await this.driverRepository.save(saveDriversData);
    // Return original generated passwords in response while keeping hashes in DB
    return saved.map(
      (drv, idx) => ({ ...drv, password: originalPasswords[idx] }) as Driver,
    );
  }


  async create(companyData: Partial<Company>): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { phone_number: companyData.phone_number }
    });

    if (company) {
      throw new ConflictException('phone number is already exists');
    }

    // Use provided password: hash for storage, but return original in response
    const originalPassword = companyData.password as string;
    const hashed = await this.authService.hashPassword(originalPassword);

    const toSave: Partial<Company> = {
      name: companyData.name,
      email: companyData.email,
      phone_number: companyData.phone_number,
      password: hashed,
    };

    const saved = await this.companyRepository.save(toSave);
    return { ...saved, password: originalPassword } as Company;
  }

  async complete(id: number, completeDataDto: CompleteCompanyDataDto): Promise<Company> {
    const updateData: any = completeDtoToPartialCompanyEntity(completeDataDto);

    const { affected } = await this.companyRepository
      .createQueryBuilder()
      .update(Company)
      .set(updateData)
      .where('id = :id', { id })
      .execute();

    if (!affected) {
      throw new NotFoundException('Company not found');
    }

    return await this.companyRepository.findOneBy({ id });
  }

  async update(id: number, updateDataDto: UpdateCompanyDataDto): Promise<Company> {
    const updateData: any = updateDtoToPartialCompanyEntity(updateDataDto);

    const originalPassword: string | undefined = updateData.password;
    if (updateData.password) {
      updateData.password = await this.authService.hashPassword(updateData.password);
    }

    const { affected } = await this.companyRepository
      .createQueryBuilder()
      .update(Company)
      .set(updateData)
      .where("id = :id", { id })
      .execute();

    if (!affected) {
      throw new NotFoundException('Company not found');
    }

    const updated = await this.companyRepository.findOneBy({ id });
    return originalPassword ? ({ ...updated, password: originalPassword } as Company) : (updated as Company);
  }

  async getRate(companyId: number): Promise<any> {
    const company = await this.companyRepository.findOne({ where: { id: companyId } });

    if (!company) {
      throw new NotFoundException('Company is not found');
    }

    const drivers = await this.driverRepository.find({
      where: { company: { id: companyId } },
      relations: { ratings: true }
    });


    const allDriverRates = drivers.reduce((rates, driver) => {
      return [...rates, ...driver.ratings];
    }, []);

    const averageRate = allDriverRates.length > 0
      ? allDriverRates.reduce((sum, rate) => sum + rate.star, 0) / allDriverRates.length
      : 0;

    return { averageRate };
  }

  private generatePassword(length: number = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[]:;,.?';
    let pwd = '';
    for (let i = 0; i < length; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  }
}
