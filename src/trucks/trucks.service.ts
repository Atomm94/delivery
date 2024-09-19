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

  async bulkInsert(data: CreateMultipleTrucksDto): Promise<Truck[]> {

    const driver = await this.driverRepository.findOne({
      where: {id: data.driverId}
    });
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const savedData = data.trucks.map((truckData) => {
      truckData['driverId'] = data.driverId;

      return this.truckRepository.insert([truckData]);
    });

    const promises = await Promise.all(savedData);

    return promises.map(result => result.generatedMaps[0] as Truck)
  }
}
