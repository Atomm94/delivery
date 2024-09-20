import { IsString, IsInt, IsEnum, IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { TruckCondition } from '../enums/truck-condition.enum';
import { Type } from 'class-transformer';

export class CreateTruckDataDto {
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

  // @IsInt()
  // max_capacity: number;
  //
  // @IsInt()
  // length: number;
  //
  // @IsInt()
  // width: number;
  //
  // @IsInt()
  // height: number;

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

  // @IsArray()
  // @ArrayNotEmpty()
  // @IsString({ each: true })
  // vehicle_title: string[];
  //
  // @IsArray()
  // @ArrayNotEmpty()
  // @IsString({ each: true })
  // insurances: string[];
  //
  // @IsArray()
  // @ArrayNotEmpty()
  // @IsString({ each: true })
  // photos: string[];
}

export class CreateMultipleTrucksDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTruckDataDto)
  trucks: CreateTruckDataDto[];
}
