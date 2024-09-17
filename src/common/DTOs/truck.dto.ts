import { IsString, IsInt, IsArray, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { TruckCondition } from '../enums/truck-condition.enum';

export class CreateTruckDto {
  @IsString()
  @IsNotEmpty()
  mark: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsNotEmpty()
  vin_code: string;

  @IsString()
  @IsNotEmpty()
  license_plate_number: string;

  @IsInt()
  max_capacity: number;

  @IsInt()
  length: number;

  @IsInt()
  width: number;

  @IsInt()
  height: number;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsEnum(TruckCondition)
  condition: TruckCondition;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  vehicle_title?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  insurances?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  photos?: string[];
}
