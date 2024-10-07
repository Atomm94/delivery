import {
  IsArray, IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional, IsPhoneNumber,
  IsString, Length,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SignUpDto {
  @IsNotEmpty({ message: 'company name is required' })
  @IsString({ message: 'company name must be a string' })
  company_name: string;

  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsNotEmpty({ message: 'phone number is required' })
  @IsString({ message: 'phone number must be a string' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'phone number must be a valid international phone number' })
  phone_number: string;

  @IsNotEmpty({ message: 'password is required' })
  @IsString({ message: 'password must be a string' })
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  password: string;
}

class ContactInfoDto {
  @IsString()
  @IsNotEmpty()
  contact_person_name: string;

  @IsOptional()
  @IsPhoneNumber(null)
  phone_number?: string;

  @IsEmail()
  email: string;
}

class CompanyInfoDto {
  @IsString()
  @IsNotEmpty()
  ITN: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber(null)
  phone_number?: string;

  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsString()
  @IsNotEmpty()
  @Length(9, 9)
  owner_social_number: string;
}

class CompanyAddressDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsOptional()
  @IsString()
  zip_code: string;
}

class AddressDto {
  @IsString()
  @IsNotEmpty()
  institution_name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsOptional()
  @IsString()
  zip_code: string;

  @IsOptional()
  @IsBoolean()
  main_address: boolean;
}

export class CompleteCustomerDataDto {
  @IsOptional()
  company_info?: CompanyInfoDto;

  @IsOptional()
  company_address?: CompanyAddressDto;

  @IsOptional()
  contact_info?: ContactInfoDto;

  @IsOptional()
  @IsArray({ message: 'organization docs must be an array' })
  @IsString({ each: true, message: 'Each doc in organization docs must be a string' })
  orgz_docs?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  adresses: AddressDto[];
}

export class UpdateCustomerDataDto {
  @IsOptional()
  company_info?: CompanyInfoDto;

  @IsOptional()
  company_address?: CompanyAddressDto;

  @IsOptional()
  contact_info?: ContactInfoDto;

  @IsOptional()
  @IsArray({ message: 'organization docs must be an array' })
  @IsString({ each: true, message: 'Each doc in organization docs must be a string' })
  orgz_docs?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  adresses: AddressDto[];
}