import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Truck } from '../../database/entities/truck.entity';
import { Driver } from '../../database/entities/driver.entity';
import { CreateMultipleTrucksDto, TruckDataDto } from '../../common/DTOs/truck.dto';
import { updateDtoToPartialTruckEntity } from '../../common/helpers/dtoToPartialEntity';

@Injectable()
export class TrucksService {
  constructor(
    @InjectRepository(Truck)
    private readonly truckRepository: Repository<Truck>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async bulkInsert(driverId: number, data: CreateMultipleTrucksDto): Promise<Truck[]> {
    const driver = await this.driverRepository.findOne({
      where: {id: driverId}
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const savedData = data.trucks.map((truckData) => {
      truckData['driver'] = driverId;

      return this.truckRepository.save([truckData]);
    });

    const { affected } = await this.driverRepository
      .createQueryBuilder()
      .update(Driver)
      .set({ isVerified: true })
      .where("id = :id", { id: driverId })
      .execute();

    if (!affected) {
      throw new UnauthorizedException('Driver is not verified');
    }

    return await Promise.all(savedData);
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
