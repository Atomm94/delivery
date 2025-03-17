import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Company } from '../../database/entities/company.entity';
import { CompanyDriver } from '../../database/entities/company-driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, CompanyDriver]), AuthModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
