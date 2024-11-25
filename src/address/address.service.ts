import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../database/entities/address.entity';
import { CreateAddressDto } from '../common/DTOs/address.dto';
import { UserRole } from '../common/enums/user-role.enum';
import { AddressType } from '../common/enums/address-type.enum';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(userId: number, role, createAddressDto: CreateAddressDto): Promise<any> {
    let createAddress: any = { customer: userId, ...createAddressDto };
    if (role === UserRole.COURIER) {
      createAddress = { driver: userId, ...createAddressDto };
    }

    if (createAddress.latitude && createAddress.longitude) {
      const {latitude, longitude, ...Dto} = createAddress;
      createAddress = {
        location: {
          type: 'Point',
          coordinates: [latitude, longitude]
        },
        ...Dto
      }
    }

    const newAddress = this.addressRepository.create(createAddress);
    return await this.addressRepository.save(newAddress);
  }

  async getAll(userId: number, role, type: AddressType): Promise<Address[]> {
    let query = 'address.customerId = :userId'
    if (role === UserRole.COURIER) {
      query = 'address.driverId = :userId'
    }

    return await this.addressRepository
      .createQueryBuilder('address')
      .where(`type = '${type}'`)
      .andWhere(query, { userId })
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

  async delete(addressId: number): Promise<any> {
    // Proceed to delete the address
    return await this.addressRepository.delete({ id: addressId });
  }
}
