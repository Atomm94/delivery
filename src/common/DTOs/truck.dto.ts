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
  @IsArray()
  @IsString({ each: true })
  vehicle_title: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  insurances: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos: string[];
}

export class CreateMultipleTrucksDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TruckDataDto)
  trucks: TruckDataDto[];
}
