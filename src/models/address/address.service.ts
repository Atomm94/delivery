import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../../database/entities/address.entity';
import { CreateAddressDto } from '../../common/DTOs/address.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import { AddressType } from '../../common/enums/address-type.enum';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class AddressService {
  constructor(
    private readonly redisService: RedisService,
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
      throw new Error('not found any addresses');
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
      throw new Error('Address not found');
    }

    return {
      ...address,
      location: {
        latitude: address.location.coordinates[0],
        longitude: address.location.coordinates[1],
      },
    };
  }

  async update(addressId: number, updateAddressDto: Partial<Address>): Promise<any> {
    const address = await this.getOne(addressId);
    if (!address) {
      throw new Error('Address not found');
    }

    const { id, ...updateAddressData } = updateAddressDto;
    await this.addressRepository.update({id}, updateAddressData)
    
    return await this.getOne(addressId);
  }

  async delete(addressId: number): Promise<any> {
    // Proceed to delete the address
    return await this.addressRepository.delete({ id: addressId });
  }
  
  async findNearAddress(driverId: number): Promise<any> {
    const redisClient = this.redisService.getClient();
    const driverData = await redisClient.get(driverId.toString());

    if (!driverData) {
      throw new Error(`No data found for driverId: ${driverId}`);
    }

    const { latitude, longitude } = JSON.parse(driverData);

    if (!latitude || !longitude) {
      throw new Error('Invalid location data for the driver');
    }

    const radius = 10; // Radius in kilometers (can be parameterized if needed)

    const searchRadius = radius * 1000; // Convert to meters
    const addresses = await this.addressRepository
      .createQueryBuilder('address')
      .where(
        `
     ST_DistanceSphere(
       ST_SetSRID(ST_Point(:longitude, :latitude), 4326),
       address.location
     ) <= :searchRadius
     `,
        { latitude, longitude, searchRadius },
      )
      .getMany()

    if (addresses.length === 0) {
      throw new Error('not found any addresses');
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
