import { Controller, Post, Get, Param, Body, Put, Req } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from '../common/DTOs/address.dto';
import { Address } from '../database/entities/address.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Addresses')  // Grouping in Swagger UI
@Controller('address')
@ApiBearerAuth('Authorization')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  // Create a new address for a customer
  @Post()
  @ApiOperation({ summary: 'Create a new address for a user' })
  @ApiResponse({
    status: 201,
    description: 'The address has been successfully created',
  })
  async create(
    @Req() req,  // Accessing the request object to get the customer
    @Body() createAddressDto: CreateAddressDto,  // Address data in the request body
  ): Promise<Address> {
    const { user } = req;  // Assuming customer is added to the request object
    return await this.addressService.create(user.id, user.role, createAddressDto);  // Use customer ID from req.user
  }

  // Get all addresses for a specific customer
  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of addresses for the user',
  })
  async getAll(
    @Req() req,  // Accessing the request object to get the customer
  ): Promise<Address[]> {
    const { user } = req;  // Assuming customer is added to the request object
    return await this.addressService.getAll(user.id, user.role);
  }

  // Get one address by its ID
  @Get(':addressId')
  @ApiResponse({
    status: 200,
    description: 'Details of the requested address',
  })
  async getOne(
    @Param('addressId') addressId: number,  // Capture addressId from route
    @Req() req,  // Accessing the request object to get the customer
  ): Promise<Address> {
    return await this.addressService.getOne(addressId);  // Fetch the address by ID and ensure it's associated with the customer
  }

  // Update an existing address
  @Put(':addressId')
  @ApiResponse({
    status: 200,
    description: 'The address has been successfully updated',
  })
  async update(
    @Param('addressId') addressId: number,  // Capture addressId from route
    @Body() updateAddressDto: Partial<Address>,  // Address data in the request body
    @Req() req,  // Accessing the request object to get the customer
  ): Promise<Address> {
    return await this.addressService.update(addressId, updateAddressDto);  // Update the address, ensuring it belongs to the customer
  }
}
