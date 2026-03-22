import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateCheckoutDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsInt()
  @IsPositive()
  routeId: number;

  @ApiProperty({ type: Number, example: 1000, description: 'Amount in dollars' })
  @IsInt()
  @IsPositive()
  price: number;

  @ApiProperty({ type: String, example: 'pm_1N...' })
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;
}
