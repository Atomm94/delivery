import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Status } from '../../common/enums/route.enum';
import { CreateRouteDto } from './route.dto';  // Assuming the Status enum is in this path

export class CreateOrderDto {
  @ApiProperty({
    description: 'The time when the loading begins for the order',
    type: String,
  })
  @IsOptional()
  @IsString()
  onloading_time: string;

  @ApiProperty({
    description: 'The start time of the order',
    type: String,
  })
  @IsOptional()
  @IsString()
  start_time: string;

  @ApiProperty({
    description: 'The type of car used for the order',
    type: String,
  })
  @IsOptional()
  @IsString()
  car_type: string;

  @ApiProperty({
    description: 'The name of the porter, if applicable',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  porter?: string;

  @ApiProperty({
    description: 'The status of the order',
    enum: Status,
    default: Status.INCOMING,
  })
  @IsOptional()
  @IsEnum(Status)
  status: Status;

  @ApiProperty({
    description: 'The routes Ids',
    required: false,
  })
  @IsOptional()
  @IsArray()
  routes?: number[];
}
