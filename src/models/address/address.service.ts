import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../../database/entities/address.entity';
import { CreateAddressDto, SearchNearDto } from '../../common/DTOs/address.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import { AddressType } from '../../common/enums/address-type.enum';
import { RedisService } from '../../redis/redis.service';
import { Driver } from '../../database/entities/driver.entity';

@Injectable()
export class AddressService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async create(userId: number, role, createAddressDto: CreateAddressDto): Promise<any> {
    const userRoleMapping = {
      [UserRole.COURIER]: { driver: userId },
      [UserRole.CUSTOMER]: { customer: userId },
      [UserRole.COMPANY]: { company: userId },
    };

    let createAddress = {
      ...userRoleMapping[role],
      ...createAddressDto,
    };

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
    const savedAddress: any = await this.addressRepository.save(newAddress);

    return {
      ...savedAddress,
      location: {
        latitude: savedAddress.location.coordinates[0],
        longitude: savedAddress.location.coordinates[1],
      }
    };
  }

  async getAll(userId: number, role, type: AddressType): Promise<Address[]> {
    let query = 'address.customerId = :userId'
    if (role === UserRole.COURIER) {
      query = 'address.driverId = :userId'
    }

   const addresses = await this.addressRepository
      .createQueryBuilder('address')
      .where(`type = '${type}'`)
      .andWhere(query, { userId })
      .getMany()

    if (addresses.length === 0) {
      return [];
    }

    return addresses.map(address => ({
      ...address,
      location: {
        latitude: address.location.coordinates[0],
        longitude: address.location.coordinates[1],
      },
    }));
  }

  async getOne(addressId: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: {
        id: addressId,
      },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return {
      ...address,
      location: {
        latitude: address.location.coordinates[0],
        longitude: address.location.coordinates[1],
      },
    };
  }

  async update(addressId: number, updateAddressDto: CreateAddressDto): Promise<any> {
    const address = await this.getOne(addressId);
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    const { latitude, longitude, ...updateAddressData } = updateAddressDto;

    updateAddressData['location'] = {
      type: 'Point',
      coordinates: [latitude, longitude],
    }

    await this.addressRepository.update({ id: addressId }, updateAddressData)
    
    return await this.getOne(addressId);
  }

  async delete(addressId: number): Promise<any> {
    // Proceed to delete the address
    return await this.addressRepository.delete({ id: addressId });
  }
  
  async findNearAddress(driverId: number, searchNearDto: SearchNearDto): Promise<any> {
    const { lat, long, radius } = searchNearDto

    const driver = await this.driverRepository.findOne({
      where: { id: driverId }
    });

    if (!driver) {
      throw new NotFoundException(`No data found for driverId: ${driverId}`);
    }

    if (!lat && !long) {
      throw new NotFoundException('Invalid location data for the driver');
    }

    const searchRadius = radius * 1000; // Convert to meters
    const addresses = await this.addressRepository
      .createQueryBuilder('address')
      .where(
        `
     ST_DistanceSphere(
       ST_SetSRID(ST_Point(:lat, :long), 4326),
       address.location
     ) <= :searchRadius
     `,
        { lat, long, searchRadius },
      )
      .getMany()

    if (addresses.length === 0) {
      return [];
    }

    return addresses.map(address => ({
      ...address,
      location: {
        latitude: address.location.coordinates[0],
        longitude: address.location.coordinates[1],
      },
    }));
  }
}
