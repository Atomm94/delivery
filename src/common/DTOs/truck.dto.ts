import { IsString, IsInt, IsEnum, IsArray, ArrayNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { TruckCondition } from '../enums/truck-condition.enum';
import { Type } from 'class-transformer';

export class TruckDataDto {
  @IsString()
  mark: string;

  @IsString()
  model: string;

  @IsString()
  year: string;

  @IsString()
  vin_code: string;

  @IsString()
  license_plate_number: string;

  @IsString()
  max_capacity: string;

  @IsString()
  length: string;

  @IsString()
  width: string;

  @IsString()
  height: string;

  @IsString()
  type: string;

  @IsEnum(TruckCondition)
  condition: TruckCondition;

  @IsOptional()
  @IsArray({ message: 'vehicle_title must be an array' })
  @IsString({ each: true, message: 'Each vehicle_title in vehicle_titles must be a string' })
  vehicle_title?: string[];

  @IsOptional()
  @IsArray({ message: 'insurance_photos must be an array' })
  @IsString({ each: true, message: 'Each insurance_photo in insurance_photos must be a string' })
  insurance_photos?: string[];

  @IsOptional()
  @IsArray({ message: 'insurance_files must be an array' })
  @IsString({ each: true, message: 'Each insurance_file in insurance_files must be a string' })
  insurance_files?: string[];

  @IsOptional()
  @IsArray({ message: 'photos must be an array' })
  @IsString({ each: true, message: 'Each photo in photos must be a string' })
  photos?: string[];
}

export class CreateMultipleTrucksDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TruckDataDto)
  trucks: TruckDataDto[];
}
