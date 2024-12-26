import { Controller, Post, Get, Param, Body, Put, Req, HttpException, Delete, HttpStatus } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from '../../common/DTOs/address.dto';
import { Address } from '../../database/entities/address.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AddressType } from '../../common/enums/address-type.enum';
import { ParseEnumPipe } from '@nestjs/common/pipes/parse-enum.pipe';

@ApiTags('Addresses')  // Grouping in Swagger UI
@Controller('address')
@ApiBearerAuth('Authorization')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  // Create a new address for a customer
  @Get('/near:driverId')
  @ApiOperation({ summary: 'find nearby address' })
  @ApiResponse({
    status: 201,
    description: 'The address has been successfully created',
  })
  async findNearby(
    @Req() req,  // Accessing the request object to get the customer
    @Param('driverId') driverId: number,
  ): Promise<Address> {
    return await this.addressService.findNearAddress(driverId)  // Use customer ID from req.user
  }

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
  @Get('all/:type')
  @ApiResponse({
    status: 200,
    description: 'List of addresses for the user',
  })
  async getAll(
    @Param('type', new ParseEnumPipe(AddressType)) type: AddressType,
    @Req() req,  // Accessing the request object to get the customer
  ): Promise<Address[]> {
    const { user } = req;  // Assuming customer is added to the request object
    return await this.addressService.getAll(user.id, user.role, type);
  }

  // Get one address by its ID
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Details of the requested address',
  })
  async getOne(
    @Param('id') addressId: number,  // Capture addressId from route
    @Req() req,  // Accessing the request object to get the customer
  ): Promise<Address> {
    return await this.addressService.getOne(addressId);  // Fetch the address by ID and ensure it's associated with the customer
  }

  // Update an existing address
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'The address has been successfully updated',
  })
  async update(
    @Param('id') addressId: number,  // Capture addressId from route
    @Body() updateAddressDto: CreateAddressDto,  // Address data in the request body
    @Req() req,  // Accessing the request object to get the customer
  ): Promise<Address> {
    return await this.addressService.update(addressId, updateAddressDto);  // Update the address, ensuring it belongs to the customer
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The address has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Address not found',
  })
  async delete(
    @Param('id') addressId: number,
    @Req() req,
  ): Promise<void> {
    const result = await this.addressService.delete(addressId);
    if (!result) {
      throw new HttpException(`Address not found`, HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
