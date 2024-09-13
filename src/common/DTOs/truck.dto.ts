import { IsString, IsInt, IsEnum, IsArray, ArrayNotEmpty } from 'class-validator';
import { TruckCondition } from '../enums/truck-condition.enum';

export class CompleteDataDto {
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
