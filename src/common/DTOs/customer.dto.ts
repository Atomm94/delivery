import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty, IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AddressType } from '../enums/address-type.enum';
import { CreateAddressDto } from './address.dto';

export class CustomersSignUpDto {
  @ApiProperty({ description: 'Company name', example: 'My Company' })
  @IsNotEmpty({ message: 'company name is required' })
  @IsString({ message: 'company name must be a string' })
  company_name: string;

  @ApiProperty({ description: 'Email address', example: 'user@example.com' })
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890' })
  @IsNotEmpty({ message: 'phone number is required' })
  @IsString({ message: 'phone number must be a string' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'phone number must be a valid international phone number' })
  phone_number: string;

  @ApiProperty({ description: 'Password', example: 'password123' })
  @IsNotEmpty({ message: 'password is required' })
  @IsString({ message: 'password must be a string' })
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  password: string;
}

class ContactInfoDto {
  @ApiProperty({ description: 'Contact person name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  contact_person_name: string;

  @ApiProperty({ description: 'Contact phone number', example: '+1234567890' })
  @IsOptional()
  @IsPhoneNumber(null)
  phone_number?: string;

  @ApiProperty({ description: 'Contact email address', example: 'contact@example.com' })
  @IsEmail()
  email: string;
}

class CompanyInfoDto {
  @ApiProperty({ description: 'Company ITN', example: '123456789' })
  @IsString()
  @IsNotEmpty()
  ITN: string;

  @ApiProperty({ description: 'Company phone number', example: '+1234567890' })
  @IsString()
  @IsOptional()
  @IsPhoneNumber(null)
  phone_number?: string;

  @ApiProperty({ description: 'Owner name', example: 'Jane Smith' })
  @IsString()
  @IsNotEmpty()
  owner: string;

  @ApiProperty({ description: 'Owner social number', example: '123456789' })
  @IsString()
  @IsNotEmpty()
  @Length(9, 9)
  owner_social_number: string;
}

class CompanyAddressDto {
  @ApiProperty({ description: 'Company address', example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'City', example: 'Metropolis' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'State', example: 'NY' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: 'Zip code', example: '12345' })
  @IsOptional()
  @IsString()
  zip_code: string;
}

export class CompleteCustomerDataDto {
  @ApiProperty({ type: CompanyInfoDto, required: false })
  @IsOptional()
  company_info?: CompanyInfoDto;

  @ApiProperty({ type: CompanyAddressDto, required: false })
  @IsOptional()
  company_address?: CompanyAddressDto;

  @ApiProperty({ type: ContactInfoDto, required: false })
  @IsOptional()
  contact_info?: ContactInfoDto;

  @ApiProperty({
    type: 'array', items: { type: 'string', format: 'binary' },
    description: 'Organization documents',
    example: ['pdf1', 'pdf2'],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'organization docs must be an array' })
  @IsString({ each: true, message: 'Each doc in organization docs must be a string' })
  orgz_docs?: string[];

  @ApiProperty({
    type: CreateAddressDto,
    isArray: true,
    description: 'List of addresses',
    required: false,
    example: [
      {
        'institution_name': 'Example Institution',
        'address': '456 Elm St',
        'city': 'Gotham',
        'state': 'CA',
        'zip_code': '98765',
        'main_address': true,
        'type': 'shipping',
        'latitude': 40.712776,
      },
      {
        'institution_name': 'Example Institution1',
        'address': '436 Elm St',
        'city': 'Phonix',
        'state': 'CA',
        'zip_code': '98465',
        'main_address': false,
        'type': 'load',
        'longitude': -74.005979,
      },
    ],
  })
  @IsOptional()
  addresses?: CreateAddressDto[];
}

export class UpdateCustomerDataDto {
  @ApiProperty({ description: 'Company name', example: 'My Company' })
  @IsOptional()
  @IsString({ message: 'company name must be a string' })
  company_name?: string;

  @ApiProperty({ description: 'Email address', example: 'user@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ApiProperty({ type: CompanyInfoDto })
  @IsOptional()
  company_info?: CompanyInfoDto;

  @ApiProperty({ type: CompanyAddressDto })
  @IsOptional()
  company_address?: CompanyAddressDto;

  @ApiProperty({ type: ContactInfoDto })
  @IsOptional()
  contact_info?: ContactInfoDto;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, description: 'Organization documents' })
  @IsOptional()
  @IsArray({ message: 'organization docs must be an array' })
  @IsString({ each: true, message: 'Each doc in organization docs must be a string' })
  orgz_docs?: string[];
}
