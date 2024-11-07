import { Controller, Post, Get, Param, Body, Put, Req } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from '../common/DTOs/address.dto';
import { Address } from '../database/entities/address.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';  // Importing the Request type

@ApiTags('Addresses')  // Grouping in Swagger UI
@Controller('address')
@ApiBearerAuth('Authorization')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  // Create a new address for a customer
  @Post(':customerId')
  @ApiOperation({ summary: 'Create a new address for a customer' })
  @ApiResponse({
    status: 201,
    description: 'The address has been successfully created',
  })
  async create(
    @Req() req: Request,  // Accessing the request object to get the customer
    @Param('customerId') customerId: number,
    @Body() createAddressDto: CreateAddressDto,  // Address data in the request body
  ): Promise<Address> {
    //const { user: customer } = req;  // Assuming customer is added to the request object
    return await this.addressService.create(customerId, createAddressDto);  // Use customer ID from req.user
  }

  // Get all addresses for a specific customer
  @Get('/all/:customerId')
  @ApiResponse({
    status: 200,
    description: 'List of addresses for the customer',
  })
  async getAll(
    @Req() req: Request,  // Accessing the request object to get the customer
    @Param('customerId') customerId: number,
  ): Promise<Address[]> {
    //const { user: customer } = req;  // Assuming customer is added to the request object
    return await this.addressService.getAll(customerId);
  }

  // Get one address by its ID
  @Get(':addressId')
  @ApiResponse({
    status: 200,
    description: 'Details of the requested address',
  })
  async getOne(
    @Param('addressId') addressId: number,  // Capture addressId from route
    @Req() req: Request,  // Accessing the request object to get the customer
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
    @Req() req: Request,  // Accessing the request object to get the customer
  ): Promise<Address> {
    return await this.addressService.update(addressId, updateAddressDto);  // Update the address, ensuring it belongs to the customer
  }
}
