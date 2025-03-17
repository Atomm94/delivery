import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CompanyDriverDto, CompleteCompanyDataDto, UpdateCompanyDataDto } from '../../common/DTOs/company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyDriver } from '../../database/entities/company-driver.entity';
import { Company } from '../../database/entities/company.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { AuthService } from '../auth/auth.service';
import {
  completeDtoToPartialCompanyEntity,
  updateDtoToPartialCompanyEntity,
} from '../../common/helpers/dtoToPartialEntity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(CompanyDriver)
    private readonly companyDriverRepository: Repository<CompanyDriver>,
    private readonly authService: AuthService,
  ) {}

  async get(condition: any): Promise<Company> {
    return await this.companyRepository.findOne({ where: condition });
  }

  async getAll(condition: any): Promise<Company[]> {
    return await this.companyRepository.find({ where: condition });
  }

  async createCompanyDriver(user: any, companyDriverData: CompanyDriverDto): Promise<any> {
    if (user.role !== UserRole.COMPANY) {
      throw new ForbiddenException('invalid company user');
    }

    const company = await this.companyRepository.findOne({
      where: { id: user.id }
    });

    if (!company) {
      throw new NotFoundException('company user is not found');
    }

    const companyDriver = await this.companyDriverRepository.findOne({
      where: { phone_number: companyDriverData.phone_number }
    });

    if (companyDriver) {
      throw new ConflictException('phone number is already exists');
    }

    const saveCompanyDriver = {
      companyId: company.id,
      phone_number: companyDriverData.phone_number,
    }

    return await this.companyDriverRepository.save(saveCompanyDriver);
  }

  async create(companyData: Partial<Company>): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { phone_number: companyData.phone_number }
    });

    if (company) {
      throw new ConflictException('phone number is already exists');
    }

    companyData.password = await this.authService.hashPassword(companyData.password);

    return await this.companyRepository.save(companyData);
  }

  async complete(id: number, completeDataDto: CompleteCompanyDataDto): Promise<Company> {
    const updateData: any = completeDtoToPartialCompanyEntity(completeDataDto);

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
