import { IsString, IsEnum, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { TruckCondition } from '../enums/truck-condition.enum';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TruckDataDto {
  @ApiProperty({
    description: 'The mark of the truck',
    example: 'Ford',
  })
  @IsString()
  mark: string;

  @ApiProperty({
    description: 'The model of the truck',
    example: 'F-150',
  })
  @IsString()
  model: string;

  @ApiProperty({
    description: 'The year of manufacture',
    example: '2021',
  })
  @IsString()
  year: string;

  @ApiProperty({
    description: 'The VIN code of the truck',
    example: '1FTEW1E59MFA12345',
  })
  @IsString()
  vin_code: string;

  @ApiProperty({
    description: 'The license plate number',
    example: 'ABC1234',
  })
  @IsString()
  license_plate_number: string;

  @ApiProperty({
    description: 'The maximum capacity of the truck',
    example: '10000 lbs',
  })
  @IsString()
  max_capacity: string;

  @ApiProperty({
    description: 'The length of the truck',
    example: '20 ft',
  })
  @IsString()
  length: string;

  @ApiProperty({
    description: 'The width of the truck',
    example: '8 ft',
  })
  @IsString()
  width: string;

  @ApiProperty({
    description: 'The height of the truck',
    example: '10 ft',
  })
  @IsString()
  height: string;

  @ApiProperty({
    description: 'The type of the truck',
    example: 'Pickup',
  })
  @IsString()
  type: string;

  @ApiProperty({
    enum: TruckCondition,
    description: 'The condition of the truck',
    example: TruckCondition.GOOD,
  })
  @IsEnum(TruckCondition)
  condition: TruckCondition;

  @ApiProperty({
    type: 'array', items: { type: 'string', format: 'binary' },
    description: 'An array of vehicle titles',
    example: ['Title1', 'Title2'],
  })
  @IsOptional()
  @IsArray({ message: 'vehicle_title must be an array' })
  @IsString({ each: true, message: 'Each vehicle_title in vehicle_titles must be a string' })
  vehicle_title?: string[];

  @ApiProperty({
    type: 'array', items: { type: 'string', format: 'binary' },
    description: 'An array of insurance photos',
    example: ['insurance1.jpg', 'insurance2.jpg'],
  })
  @IsOptional()
  @IsArray({ message: 'insurance_photos must be an array' })
  @IsString({ each: true, message: 'Each insurance_photo in insurance_photos must be a string' })
  insurance_photos?: string[];

  @ApiProperty({
    type: 'array', items: { type: 'string', format: 'binary' },
    description: 'An array of insurance files',
    example: ['insurance-file1.pdf', 'insurance-file2.pdf'],
  })
  @IsOptional()
  @IsArray({ message: 'insurance_files must be an array' })
  @IsString({ each: true, message: 'Each insurance_file in insurance_files must be a string' })
  insurance_files?: string[];

  @ApiProperty({
    type: 'array', items: { type: 'string', format: 'binary' },
    description: 'An array of photos',
    example: ['photo1.jpg', 'photo2.jpg'],
  })
  @IsOptional()
  @IsArray({ message: 'photos must be an array' })
  @IsString({ each: true, message: 'Each photo in photos must be a string' })
  photos?: string[];
}

export class CreateMultipleTrucksDto {
  @ApiProperty({
    type: [TruckDataDto],
    description: 'An array of truck data',
    example: [
      {
        mark: 'Ford',
        model: 'F-150',
        year: '2021',
        vin_code: '1FTEW1E59MFA12345',
        license_plate_number: 'ABC1234',
        max_capacity: '10000 lbs',
        length: '20 ft',
        width: '8 ft',
        height: '10 ft',
        type: 'Pickup',
        condition: TruckCondition.GOOD,
        vehicle_title: ['Title1', 'Title2'],
        insurance_photos: ['insurance1.jpg', 'insurance2.jpg'],
        insurance_files: ['insurance-file1.pdf', 'insurance-file2.pdf'],
        photos: ['photo1.jpg', 'photo2.jpg'],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TruckDataDto)
  trucks: TruckDataDto[];
}
