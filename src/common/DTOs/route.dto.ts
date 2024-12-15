import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Porter, Status } from '../enums/route.enum';
import { CreateProductDto } from './product.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The ID of the route related to the order',
    type: Number,
  })
  route: number;

  @ApiProperty({
    description: 'The time when the loading begins for the order',
    type: String,
    example: '2024-11-10T08:00:00Z',  // Example time in ISO format
  })
  @IsOptional()
  @IsString()
  onloading_time: string;

  @ApiProperty({
    description: 'The ID of the address related to the order',
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  address: number;

  @ApiProperty({
    description: 'The list of products related to the order',
    type: [CreateProductDto],
    example: [  // Example array of products
      {
        name: 'Sample Product',
        weight: 5.0,
        length: 30,
        width: 20,
        height: 15,
        measure: 'bottle',  // Measure unit (e.g., bottle)
        type: 'product',  // Product type (e.g., product)
      },
      {
        name: 'Another Product',
        weight: 2.5,
        length: 15,
        width: 10,
        height: 5,
        measure: 'bottle',
        type: 'box',
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  products: CreateProductDto[];

  @ApiProperty({
    description: 'order price',
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  price: number;
}


export class CreateRouteDto {
  @ApiProperty({
    description: 'The start time of the order',
    type: String,
    example: '2024-11-10T09:00:00Z',  // Example start time in ISO format
  })
  @IsOptional()
  @IsString()
  start_time: string;

  @ApiProperty({
    description: 'The type of car used for the order',
    type: String,
    example: 'Truck',  // Example car type
  })
  @IsOptional()
  @IsString()
  car_type: string;

  @ApiProperty({
    description: 'The name of the porter, if applicable',
    enum: Porter,
    default: Porter['Without porter'],
    example: Porter['Without porter'],
  })
  @IsOptional()
  @IsEnum(Porter)
  porter: Porter;

  @ApiProperty({
    description: 'The list of orders related to the route',
    type: [CreateOrderDto],
    example: [  // Example array of orders
      {
        address: 1,
        onloading_time: '2024-11-10T09:00:00Z',
        price: 1200,
        products: [
          { name: 'Sample Product', weight: 5.0, length: 30, width: 20, height: 15, measure: 'bottle', type: 'product' },
        ],
      },
      {
        address: 2,
        onloading_time: '2024-12-10T09:00:00Z',
        price: 1200,
        products: [
          { name: 'Another Product', weight: 2.5, length: 15, width: 10, height: 5, measure: 'bottle', type: 'box' },
        ],
      },
    ],
  })
  @IsArray()
  orders: CreateOrderDto[];

  @ApiProperty({
    description: 'The list of load address IDs for the route',
    type: [Number],
    example: [3, 4],  // Example list of load addresses
  })
  @IsArray()
  loadAddresses: number[];
}