import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Truck } from '../../database/entities/truck.entity';
import { Driver } from '../../database/entities/driver.entity';
import { CreateMultipleTrucksDto, TruckDataDto } from '../../common/DTOs/truck.dto';
import { updateDtoToPartialTruckEntity } from '../../common/helpers/dtoToPartialEntity';
import { UserRole } from '../../common/enums/user-role.enum';
import { Company } from '../../database/entities/company.entity';

@Injectable()
export class TrucksService {
  constructor(
    @InjectRepository(Truck)
    private readonly truckRepository: Repository<Truck>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async bulkInsert(userId: number, role: any, data: CreateMultipleTrucksDto): Promise<Truck[]> {
    let responseData: any

    if (role !== UserRole.COMPANY) {
      const driver = await this.driverRepository.findOne({
        where: {id: userId}
      });

      if (!driver) {
        throw new NotFoundException('Driver not found');
      }
      const savedDriverData = data.trucks.map((truckData) => {
        truckData['driver'] = userId;

        return this.truckRepository.save([truckData]);
      });

      const { affected } = await this.driverRepository
        .createQueryBuilder()
        .update(Driver)
        .set({ isVerified: true })
        .where("id = :id", { id: userId })
        .execute();

      if (!affected) {
        throw new UnauthorizedException('Driver is not verified');
      }

      responseData = await Promise.all(savedDriverData);
    } else {
      const company = await this.companyRepository.findOne({
        where: {id: userId}
      })
      if (!company) {
        throw new NotFoundException('Company not found');
      }
      const savedCompanyData = data.trucks.map((truckData) => {
        truckData['company'] = userId;

        return this.truckRepository.save([truckData]);
      });

      const { affected } = await this.companyRepository
        .createQueryBuilder()
        .update(Company)
        .set({ isVerified: true })
        .where("id = :id", { id: userId })
        .execute();

      if (!affected) {
        throw new UnauthorizedException('Company is not verified');
      }

      responseData = await Promise.all(savedCompanyData);
    }

    return responseData;
  }

  async update(id: number, updatedData: TruckDataDto): Promise<Truck> {
    const updateData = updateDtoToPartialTruckEntity(updatedData);

    for (let key in updateData) {
      if (!key || !updatedData[key]?.length) {
        delete updateData[key];
      }
    }

    const { affected } = await this.truckRepository
      .createQueryBuilder()
      .update(Truck)
      .set(updateData)
      .where("id = :id", { id })
      .execute();

    if (!affected) {
      throw new NotFoundException('Truck not found');
    }

    return await this.truckRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<number> {

    const { affected } = await this.truckRepository.delete({ id });

    if (!affected) {
      throw new NotFoundException('Truck not found');
    }

    return affected;
  }

}
