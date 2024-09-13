import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Truck } from '../database/entities/truck.entity';

@Injectable()
export class TrucksService {
  constructor(
    @InjectRepository(Truck)
    private readonly truckRepository: Repository<Truck>,
  ) {}

  async bulkInsert(data: Partial<Truck>[]): Promise<Truck> {
    await this.truckRepository.insert(data);
  }
}
