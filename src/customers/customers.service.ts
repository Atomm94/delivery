import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Driver } from '../database/entities/driver.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { Customer } from '../database/entities/customer.entity';
import { CompleteDriverDataDto, UpdateDataDto } from '../common/DTOs/driver.dto';
import {
  completeDtoToPartialDriverEntity,
  DtoToPartialCustomerEntity,
  updateDtoToPartialDriverEntity,
} from '../common/helpers/dtoToPartialEntity';
import { CompleteCustomerDataDto, UpdateCustomerDataDto } from '../common/DTOs/customer.dto';
import { Address } from '../database/entities/address.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly authService: AuthService,
  ) {}

  async create(customerData: Partial<Customer>): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { phone_number: customerData.phone_number }
    });

    if (customer) {
      throw new ConflictException('phone number is already exists');
    }

    customerData.password = await this.authService.hashPassword(customerData.password);

    return await this.customerRepository.save(customerData);
  }

  async complete(id: number, completeDataDto: CompleteCustomerDataDto): Promise<Customer> {
    const updateData = DtoToPartialCustomerEntity(completeDataDto);

    const { addresses, ...completeCustomerInfo } = updateData //?????????

    const ok: any = completeCustomerInfo

    console.log(addresses);
    console.log(completeCustomerInfo);

    const { affected } = await this.customerRepository
      .createQueryBuilder()
      .update(Customer)
      .set(ok)
      .where("id = :id", { id })
      .execute();

    if (!affected) {
      throw new NotFoundException('Customer not found');
    }

    await this.addressRepository.insert(addresses);

    return await this.customerRepository.findOne({ where: { id }, relations: ['addresses'] });
  }

  // async update(id: number, updateDataDto: UpdateCustomerDataDto): Promise<Customer> {
  //   const updateData = DtoToPartialCustomerEntity(updateDataDto);
  //
  //   const { affected } = await this.customerRepository
  //     .createQueryBuilder()
  //     .update(Customer)
  //     .set(updateData)
  //     .where("id = :id", { id })
  //     .execute();
  //
  //   if (!affected) {
  //     throw new NotFoundException('Customer not found');
  //   }
  //
  //   return await this.customerRepository.findOneBy({ id });
  // }
}
