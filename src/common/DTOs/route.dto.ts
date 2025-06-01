import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentStatus, Porter, Status } from '../enums/route.enum';
import { CreateProductDto } from './product.dto';
import { Transform } from 'class-transformer';

export class OrderProductDto {
  count: number;
  price: number;
  product: CreateProductDto;
}

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
    type: [OrderProductDto],
    example: [  // Example array of products
      {
        price: 50,
        count: 3,
        product: {
          name: 'Sample Product',
          weight: 5.0,
          length: 30,
          width: 20,
          height: 15,
          measure: 'bottle',  // Measure unit (e.g., bottle)
          type: 'product',  // Product type (e.g., product)
        }
      },
      {
        price: 65,
        count: 4,
        product: {
          name: 'Another Product',
          weight: 2.5,
          length: 15,
          width: 10,
          height: 5,
          measure: 'bottle',
          type: 'box',
        }
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  products: OrderProductDto[];

  @ApiProperty({
    description: 'order price',
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'The ID of the invoice related to the order',
    type: Number,
    example: 1, // Example invoice ID
  })
  @IsInt()
  invoiceId: number;

  @IsOptional()
  @IsString()
  verify_code: string;
}

export class CreateRouteDto {
  @ApiProperty({
    description: 'The start time of the order',
    type: Date,
    example: '2024-11-10T09:00:00Z',  // Example start time in ISO format
  })
  @IsOptional()
  start_time: Date;

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
    default: 1,
    example: 1,
  })
  @IsOptional()
  porter: number;

  @ApiProperty({
    description: 'The list of orders related to the route',
    type: [CreateOrderDto],
    example: [  // Example array of orders
      {
        address: 1,
        onloading_time: '2024-11-10T09:00:00Z',
        price: 1200,
        invoiceId: 1,
        products: [
          {
            price: 50,
            count: 3,
            product: { name: 'Sample Product', weight: 5.0, length: 30, width: 20, height: 15, measure: 'bottle', type: 'product' },
          }
        ],
      },
      {
        address: 2,
        onloading_time: '2024-12-10T09:00:00Z',
        price: 1200,
        invoiceId: 2,
        products: [
          {
            price: 50,
            count: 3,
            product: { name: 'Another Product', weight: 2.5, length: 15, width: 10, height: 5, type: 'box' },
          }
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

  @ApiProperty({
    description: 'The ID of the invoice related to the route',
    type: Number,
    example: 1, // Example invoice ID
  })
  @IsInt()
  invoiceId: number;

  @ApiProperty({
    description: 'The payment status of the route',
    enum: PaymentStatus,
    default: PaymentStatus.NOT_PAYED,
    example: PaymentStatus.PAYED,
  })
  @IsOptional()
  payment: string;

}


export class UpdateRouteDto {
  @ApiProperty({
    description: 'The start time of the order',
    type: Date,
    example: '2024-11-10T09:00:00Z', // Example start time in ISO format
  })
  @IsOptional()
  start_time?: Date;

  @ApiProperty({
    description: 'The type of car used for the order',
    type: String,
    example: 'Truck', // Example car type
  })
  @IsOptional()
  @IsString()
  car_type?: string;

  @ApiProperty({
    description: 'The name of the porter, if applicable',
    enum: Porter,
    default: 1,
    example: 1,
  })
  @IsOptional()
  porter?: string;

  @ApiProperty({
    enum: Status,
    description: 'The current status of the route',
    default: Status.INCOMING,
    example: Status.IN_PROGRESS,
  })
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'The list of orders related to the route',
    example: [
      {
        id: 15,
        address: {
          id: 1,
          institution_name: 'University of Example',
          address: '123 Main St, Example City, EX 12345',
          city: 'Example City',
          state: 'EX',
          zip_code: '12345',
          main: false,
          type: 'shipping',
          location: {
            type: 'Point',
            coordinates: [40.712776, -74.005974],
          },
        },
        onloading_time: '2024-11-10T09:00:00Z',
        price: 1200,
        invoiceId: 1,
        products: [
          {
            price: 50,
            count: 3,
            product: {
              id: 17,
              name: 'Sample Product',
              weight: 5,
              length: 30,
              width: 20,
              height: 15,
              measure: 'bottle',
              type: 'product',
            },
          },
        ],
      },
      {
        id: 16,
        address: {
          id: 2,
          institution_name: 'University of Example',
          address: '123 Main St, Example City, EX 12345',
          city: 'Example City',
          state: 'EX',
          zip_code: '12345',
          main: false,
          type: 'load',
          location: {
            type: 'Point',
            coordinates: [40.712776, -74.005974],
          },
        },
        onloading_time: '2024-12-10T09:00:00Z',
        price: 1200,
        invoiceId: 2,
        products: [
          {
            price: 50,
            count: 3,
            product: {
              id: 18,
              name: 'Another Product',
              weight: 2.5,
              length: 15,
              width: 10,
              height: 5,
              measure: null,
              type: 'box',
            },
          },
        ],
      },
    ],
  })
  @IsOptional()
  @IsArray()
  orders?: [];

  @ApiProperty({
    description: 'The list of load address IDs for the route',
    type: [Number],
    example: [3, 4],
  })
  @IsOptional()
  @IsArray()
  loadAddresses?: number[];

  @ApiProperty({
    description: 'The ID of the invoice related to the route',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  invoiceId?: number;

  @ApiProperty({
    description: 'The payment status of the route',
    enum: PaymentStatus,
    default: PaymentStatus.NOT_PAYED,
    example: PaymentStatus.PAYED,
  })
  @IsOptional()
  payment?: string;
}


export class ChangeStatusDto {
  @ApiProperty({
    description: 'The current status of the route',
    enum: Status,
    default: Status.INCOMING,
    example: Status.IN_PROGRESS,
  })
  @IsNotEmpty()
  status: Status;
}

export class TakeRouteDto {
  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty({ message: 'routeId is required' })
  @IsNumber({}, { message: 'routeId must be a number' })
  routeId: number;

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty({ message: 'truckId is required' })
  @IsNumber({}, { message: 'truckId must be a number' })
  truckId: number;

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty({ message: 'driverId is required' })
  @IsNumber({}, { message: 'driverId must be a number' })
  driverId: number;
}

export class SearchByLocationDto {
  @ApiProperty({
    description: 'The status of the route',
    enum: Status,
    default: Status.INCOMING,
    example: Status.IN_PROGRESS,
  })
  @IsNotEmpty()
  status: Status;

  @ApiProperty({
    description: 'Search radius in kilometers',
    type: Number,
    example: 20,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  radius?: number;

  @ApiProperty({
    description: 'Latitude of the location',
    type: Number,
    example: 40.712776,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  lat?: number;

  @ApiProperty({
    description: 'Longitude of the location',
    type: Number,
    example: -74.005974,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  long?: number;
}