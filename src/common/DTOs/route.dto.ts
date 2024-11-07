import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateRouteDto {
  @ApiProperty({
    description: 'The ID of the address related to the route',
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  addressId: number;

  @ApiProperty({
    description: 'The ID of the product related to the route',
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  productId: number;
}
