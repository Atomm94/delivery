import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength, Validate,
} from 'class-validator';
import { IsDriverPhoneNumberUnique } from '../../validators/unique.validation';

export class SignUpDto {
  @IsNotEmpty({ message: 'first name is required' })
  @IsString({ message: 'first name must be a string' })
  firstName: string;

  @IsNotEmpty({ message: 'last name is required' })
  @IsString({ message: 'last name must be a string' })
  lastName: string;

  @IsNotEmpty({ message: 'phone number is required' })
  @IsString({ message: 'phone number must be a string' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'phone number must be a valid international phone number' })
  //@Validate(IsDriverPhoneNumberUnique)
  phone_number: string;

  @IsNotEmpty({ message: 'password is required' })
  @IsString({ message: 'password must be a string' })
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  password: string;
}

export class CompleteDriverDataDto {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Social number must be a string' })
  social_number?: string;

  @IsOptional()
  @IsString({ message: 'License must be a string' })
  license?: string;

  @IsOptional()
  @IsString({ message: 'Identity must be a string' })
  identity?: string;

  @IsOptional()
  @IsString({ message: 'Operational state must be a string' })
  op_state?: string;

  @IsOptional()
  @IsArray({ message: 'operations cities must be an array' })
  @IsString({ each: true, message: 'Each city in operations cities must be a string' })
  op_cities?: string[];

  porter: boolean;
  second_porter: boolean;
  third_porter: boolean;
  emergency_driver: boolean;
}