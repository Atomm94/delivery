import {
  IsArray,
  IsEmail,
  IsNotEmpty, IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { TakeRouteDto } from './route.dto';

export class DriversSignUpDto {
  @ApiProperty({
    example: 'John',
    required: true
  })
  @IsNotEmpty({ message: 'first name is required' })
  @IsString({ message: 'first name must be a string' })
  firstName: string;

  @ApiProperty({
    example: 'Mccartey',
    required: true
  })
  @IsNotEmpty({ message: 'last name is required' })
  @IsString({ message: 'last name must be a string' })
  lastName: string;

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

export class CompleteDriverDataDto {
  @ApiProperty({
    example: 'john@gmail.com'
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ApiProperty({
    example: '121fsssf55'
  })
  @IsOptional()
  @IsString({ message: 'Social number must be a string' })
  social_number?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'file uploads',
  })
  @IsOptional()
  @IsString({ message: 'License must be a string' })
  license?: string;
///////////////////////////////////////////////////////////////////////
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'file uploads',
  })
  @IsOptional()
  @IsString({ message: 'Identity must be a string' })
  identity?: string;

  @ApiProperty({
    example: 'Arizona'
  })
  @IsOptional()
  @IsString({ message: 'Operational state must be a string' })
  op_state?: string;

  @ApiProperty({
    type: [String],  // Specifies that the property is an array of strings
    description: 'A list of operational cities', // Description for Swagger
    example: ['New York', 'Los Angeles'], // Example values for Swagger UI
    required: false,  // Since the field is optional, this should be false
  })
  @IsOptional()
  @IsArray({ message: 'Operational cities must be an array' })
  @IsString({ each: true, message: 'Each city in operations cities must be a string' })
  op_cities?: string[];
/////////////////////////////////////////////////////////////
  @ApiProperty({
    type: Boolean,
    description: 'A boolean number value',
    example: 1
  })
  @IsOptional()
  porter: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'A boolean number value',
    example: 1
  })
  @IsOptional()
  second_porter: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'A boolean number value',
    example: 1
  })
  @IsOptional()
  third_porter: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'A boolean number value',
    example: 1
  })
  @IsOptional()
  emergency_driver: boolean;
}

export class UpdateDataDto {
  @ApiProperty({
    example: 'Poll'
  })
  @IsOptional()
  @IsString({ message: 'first name must be a string' })
  firstName: string;

  @ApiProperty({
    example: 'Johnson'
  })
  @IsOptional()
  @IsString({ message: 'last name must be a string' })
  lastName: string;

  @ApiProperty({
    example: 'pol123#'
  })
  @IsOptional()
  @IsString({ message: 'password must be a string' })
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  password: string;

  @ApiProperty({
    example: 'pol@gmail.com'
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ApiProperty({
    example: 'addsg442ds'
  })
  @IsOptional()
  @IsString({ message: 'Social number must be a string' })
  social_number?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'file uploads',
  })
  @IsOptional()
  @IsString({ message: 'License must be a string' })
  license?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'file uploads',
  })
  @IsOptional()
  @IsString({ message: 'Identity must be a string' })
  identity?: string;

  @ApiProperty({
    example: 'California'
  })
  @IsOptional()
  @IsString({ message: 'Operational state must be a string' })
  op_state?: string;

  @ApiProperty({
    type: [String],
    description: 'An array of Operational cities',
    example: ['Los Angeles', 'San Francisco'],
  })
  @IsOptional()
  @IsArray({ message: 'operations cities must be an array' })
  @IsString({ each: true, message: 'Each city in operations cities must be a string' })
  op_cities?: string[];

  @ApiProperty({
    type: Boolean,
    description: 'A boolean number value',
    example: 1
  })
  @IsOptional()
  porter: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'A boolean number value',
    example: 1
  })
  @IsOptional()
  second_porter: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'A boolean number value',
    example: 1
  })
  @IsOptional()
  third_porter: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'A boolean number value',
    example: 1
  })
  @IsOptional()
  emergency_driver: boolean;
}

export class DriverVerifyCode {
  @ApiProperty({
    example: '123456',
    description: 'Verification code for driver',
    required: true,
  })
  @IsNotEmpty({ message: 'Verification code is required' })
  @IsString({ message: 'Verification code must be a string' })
  verify_code: string;
}

export class DriverTakeRouteDto extends OmitType(TakeRouteDto, ['driverId'] as const){}