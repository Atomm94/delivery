import { IsString, IsEnum, IsOptional, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../../common/enums/route.enum';
import { Type } from 'class-transformer';
import { TruckDataDto } from './truck.dto';

class ItemDto {
  @ApiProperty({
    description: 'The name of the item',
    example: 'Item Name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The count of the item',
    example: 10,
  })
  @IsNumber()
  count: number;

  @ApiProperty({
    description: 'The price of the item',
    example: 15.50,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'The weight of the item',
    example: 5.0,
  })
  @IsNumber()
  weight: number;

  @ApiProperty({
    description: 'The length of the item',
    example: 30,
  })
  @IsNumber()
  length: number;

  @ApiProperty({
    description: 'The width of the item',
    example: 20,
  })
  @IsNumber()
  width: number;

  @ApiProperty({
    description: 'The height of the item',
    example: 15,
  })
  @IsNumber()
  height: number;

  @ApiProperty({
    description: 'The measure unit of the item (optional)',
    example: 'pcs',
    required: false,
  })
  @IsOptional()
  @IsString()
  measure?: string;
}

export class CreateRouteDto {
  @ApiProperty({
    description: 'The onloading time of the route',
    example: '16/10/2024 17:33',
    required: true,
  })
  @IsString()
  onloading_time: string;

  @ApiProperty({
    description: 'The start time of the route',
    example: '16/10/2024 18:00',
    required: true,
  })
  @IsString()
  start_time: string;

  @ApiProperty({
    description: 'The type of vehicle used for the route',
    example: 'Box Truck',
    required: true,
  })
  @IsString()
  car_type: string;

  @ApiProperty({
    description: 'The name of the porter (optional)',
    example: 'Without porter',
    required: false,
  })
  @IsOptional()
  @IsString()
  porter?: string;

  @ApiProperty({
    description: 'The status of the route',
    enum: Status,
    required: false,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({
    description: 'Array of address IDs associated with the route (optional)',
    example: [1, 2, 3],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true }) // Ensure each item in the array is a number
  addresses?: number[];

  @ApiProperty({
    description: 'Items associated with the route',
    type: [ItemDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}
