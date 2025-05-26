// import { IntersectionType } from '@nestjs/mapped-types';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
  ArrayMinSize, IsArray,
} from 'class-validator';
import { CompleteDriverDataDto, DriversSignUpDto } from './driver.dto';
import { TakeRouteDto } from './route.dto';
import { TruckCondition } from '../enums/truck-condition.enum';
import { TruckDataDto } from './truck.dto';

export class CompanySignUpDto {
  @ApiProperty({
    example: 'John',
    required: true
  })
  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'name must be a string' })
  name: string;


  @ApiProperty({ description: 'Email address', example: 'user@example.com' })
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ApiProperty({
    example: '+661948826',
    required: true
  })
  @IsNotEmpty({ message: 'phone number is required' })
  @IsString({ message: 'phone number must be a string' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'phone number must be a valid international phone number' })
    //@Validate(IsDriverPhoneNumberUnique)
  phone_number: string;

  @ApiProperty({
    example: 'John123#',
    required: true
  })
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

export class CompleteCompanyDataDto {
  @ApiProperty({ example: '+1234567890', required: true })
  @IsNotEmpty({ message: 'phone number is required' })
  @IsString({ message: 'phone number must be a string' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'phone number must be a valid international phone number' })
  phone_number: string;

  @ApiProperty({ example: 'John', required: true })
  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'name must be a string' })
  name: string;

  @ApiProperty({ example: 'example@domain.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email?: string;

  @ApiProperty({ example: 'securePassword123', required: true })
  @IsNotEmpty({ message: 'password is required' })
  @IsString({ message: 'password must be a string' })
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ example: '123456789', required: false })
  @IsOptional()
  @IsString({ message: 'ITN must be a string' })
  ITN?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString({ message: 'owner must be a string' })
  owner?: string;

  @ApiProperty({ example: '999-99-9999', required: false })
  @IsOptional()
  @IsString({ message: 'Owner social number must be a string' })
  owner_social_number?: string;

  @ApiProperty({ example: '123 Main St', required: false })
  @IsOptional()
  @IsString({ message: 'address must be a string' })
  address?: string;

  @ApiProperty({ example: 'Los Angeles', required: false })
  @IsOptional()
  @IsString({ message: 'city must be a string' })
  city?: string;

  @ApiProperty({ example: 'CA', required: false })
  @IsOptional()
  @IsString({ message: 'state must be a string' })
  state?: string;

  @ApiProperty({ example: '90001', required: false })
  @IsOptional()
  @IsString({ message: 'zip code must be a string' })
  zip_code?: string;

  @ApiProperty({ example: 'CA', required: false })
  @IsOptional()
  @IsString({ message: 'operation state must be a string' })
  op_state?: string;

  @ApiProperty({ example: 'Los Angeles', required: false })
  @IsOptional()
  @IsString({ message: 'operation city must be a string' })
  op_city?: string;

  @ApiProperty({ type: ContactInfoDto })
  @IsOptional()
  contact_person_info?: ContactInfoDto;
}

export class UpdateCompanyDataDto {
  @ApiProperty({
    example: 'Poll'
  })
  @IsOptional()
  @IsString({ message: 'name must be a string' })
  name?: string;

  @ApiProperty({ description: 'Email address', example: 'user@example.com' })
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ApiProperty({
    example: 'pol123#'
  })
  @IsOptional()
  @IsString({ message: 'password must be a string' })
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  password?: string;
}

class CompanyDriverDto extends IntersectionType(
  DriversSignUpDto,
  CompleteDriverDataDto
) {}

export class CompanyMultipleDriverDto {
  @ApiProperty({
    type: [CompanyDriverDto],
    description: 'An array of company driver data',
    example: [{
      name: 'John Doe',
      email: 'john@example.com',
      phone_number: '+1234567890',
      password: 'Password123',
      license_number: 'DL123456',
      license_exp: '2025-12-31',
      license_class: 'Class A',
      medical_card_exp: '2024-06-30',
      social_number: '123-45-6789',
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90001',
      drug_test: 'drug-test.pdf',
      mvr: 'mvr.pdf',
      license_photo: 'license.jpg',
      medical_card: 'medical.pdf',
    }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompanyDriverDto)
  @ArrayMinSize(1)
  drivers: CompanyDriverDto[]
}

export class CompanyTakeRouteDto extends TakeRouteDto{}