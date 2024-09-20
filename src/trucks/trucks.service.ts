import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Truck } from '../database/entities/truck.entity';
import { Driver } from '../database/entities/driver.entity';
import { CreateMultipleTrucksDto } from '../common/DTOs/truck.dto';

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

    return await Promise.all(savedData);
  }
}
