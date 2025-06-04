import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CompanyMultipleDriverDto, CompleteCompanyDataDto, UpdateCompanyDataDto } from '../../common/DTOs/company.dto';
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


    const saveDriversData = [];
    for await (const driverData of data.drivers) {
      driverData.password = await this.authService.hashPassword(driverData.password);
      saveDriversData.push({
        ...driverData,
        company: companyId,
      });
    }

    return await this.driverRepository.save(saveDriversData);
  }


  // async create(companyData: Partial<Company>): Promise<Company> {
  //   const company = await this.companyRepository.findOne({
  //     where: { phone_number: companyData.phone_number }
  //   });
  //
  //   if (company) {
  //     throw new ConflictException('phone number is already exists');
  //   }
  //
  //   companyData.password = await this.authService.hashPassword(companyData.password);
  //
  //   return await this.companyRepository.save(companyData);
  // }

  async complete(completeDataDto: CompleteCompanyDataDto): Promise<Company> {
    const companyData: any = completeDtoToPartialCompanyEntity(completeDataDto);

    const company = await this.companyRepository.findOne({
      where: { phone_number: companyData.phone_number }
    });

    if (company) {
      throw new ConflictException('phone number is already exists');
    }

    companyData.password = await this.authService.hashPassword(companyData.password);

    return await this.companyRepository.save(companyData);
  }

  async update(id: number, updateDataDto: UpdateCompanyDataDto): Promise<Company> {
    const updateData: any = updateDtoToPartialCompanyEntity(updateDataDto);

    const { affected } = await this.companyRepository
      .createQueryBuilder()
      .update(Company)
      .set(updateData)
      .where("id = :id", { id })
      .execute();

    if (!affected) {
      throw new NotFoundException('Company not found');
    }

    return await this.companyRepository.findOneBy({ id });
  }
}
