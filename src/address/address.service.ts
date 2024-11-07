import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../database/entities/address.entity';
import { CreateAddressDto } from '../common/DTOs/address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(customer: number, createAddressDto: CreateAddressDto): Promise<any> {
    const createAddress: any = { customer, ...createAddressDto };
    const newAddress = this.addressRepository.create(createAddress);
    return await this.addressRepository.save(newAddress);
  }

  async getAll(customerId: number): Promise<Address[]> {
    return await this.addressRepository
      .createQueryBuilder('address')
      .andWhere('address.customerId = :customerId', { customerId })
      .getMany();
  }

  async getOne(addressId: number): Promise<Address> {
    return await this.addressRepository.findOne({
      where: {
        id: addressId,
      },
    });
  }

  async update(addressId: number, updateAddressDto: Partial<Address>): Promise<Address> {
    const address = await this.getOne(addressId);
    if (!address) {
      throw new Error('Address not found');
    }

    Object.assign(address, updateAddressDto);
    return await this.addressRepository.save(address);
  }
}
