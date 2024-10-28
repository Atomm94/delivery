import {
  IsArray,
  IsBoolean,
  IsEmail, IsEnum,
  IsNotEmpty,
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
import { TruckCondition } from '../enums/truck-condition.enum';
import { AddressType } from '../enums/address-type.enum';

export class SignUpDto {
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

class AddressDto {
  @ApiProperty({ description: 'Institution name', example: 'Example Institution' })
  @IsString()
  @IsNotEmpty()
  institution_name: string;

  @ApiProperty({ description: 'Address', example: '456 Elm St' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'City', example: 'Gotham' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'State', example: 'CA' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: 'Zip code', example: '98765' })
  @IsOptional()
  @IsString()
  zip_code: string;

  @ApiProperty({ description: 'Is main address?', example: true })
  @IsOptional()
  @IsBoolean()
  main_address: boolean;

  @ApiProperty({
    enum: AddressType,
    description: 'The type of address ` shipping || load',
    example: AddressType.SHIPPING,
  })
  @IsOptional()
  @IsEnum(AddressType)
  type?: AddressType;
}

export class CompleteCustomerDataDto {
  @ApiProperty({ type: CompanyInfoDto })
  @IsOptional()
  company_info?: CompanyInfoDto;

  @ApiProperty({ type: CompanyAddressDto })
  @IsOptional()
  company_address?: CompanyAddressDto;

  @ApiProperty({ type: ContactInfoDto })
  @IsOptional()
  contact_info?: ContactInfoDto;

  @ApiProperty({
    type: [String],
    description: 'Organization documents',
    example: ['doc1.pdf', 'doc2.pdf'],
  })
  @IsOptional()
  @IsArray({ message: 'organization docs must be an array' })
  @IsString({ each: true, message: 'Each doc in organization docs must be a string' })
  orgz_docs?: string[];

  @ApiProperty({ type: [AddressDto], description: 'List of addresses' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses: AddressDto[];
}

export class UpdateCustomerDataDto {
  @ApiProperty({ type: CompanyInfoDto })
  @IsOptional()
  company_info?: CompanyInfoDto;

  @ApiProperty({ type: CompanyAddressDto })
  @IsOptional()
  company_address?: CompanyAddressDto;

  @ApiProperty({ type: ContactInfoDto })
  @IsOptional()
  contact_info?: ContactInfoDto;

  @ApiProperty({ type: [String], description: 'Organization documents' })
  @IsOptional()
  @IsArray({ message: 'organization docs must be an array' })
  @IsString({ each: true, message: 'Each doc in organization docs must be a string' })
  orgz_docs?: string[];

  @ApiProperty({ type: [AddressDto], description: 'List of addresses' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses: AddressDto[];
}
