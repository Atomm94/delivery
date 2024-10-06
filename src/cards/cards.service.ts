import { Injectable, NotFoundException } from '@nestjs/common';
import { Card } from '../database/entities/card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from '../database/entities/driver.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    private readonly cardRepository: Repository<Card>,
  ) {}

  async get(cardId) {
    const card = await this.cardRepository.findOne({ where: { id: cardId } });

    if (!card) {
      throw new NotFoundException(`Card is not found`);
    }

    return card;
  }

  async create(driverId, card: Partial<Card>): Promise<Card> {
    const driver = await this.driverRepository.findOne({ where: { id: driverId } });

    if (!driver) {
      throw new NotFoundException(`Driver is not found`);
    }

    return await this.cardRepository.save({ ...card, driver });
  }
}
