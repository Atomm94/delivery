import { IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Measure } from '../../common/enums/product.enum';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Sample Product',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The weight of the product in kilograms',
    example: 5.0,
    required: true,
  })
  @IsNumber()
  weight: number;

  @ApiProperty({
    description: 'The length of the product in centimeters',
    example: 30,
    required: true,
  })
  @IsNumber()
  length: number;

  @ApiProperty({
    description: 'The width of the product in centimeters',
    example: 20,
    required: true,
  })
  @IsNumber()
  width: number;

  @ApiProperty({
    description: 'The height of the product in centimeters',
    example: 15,
    required: true,
  })
  @IsNumber()
  height: number;

  @ApiProperty({
    description: 'The measure unit of the product',
    enum: Measure,
    required: true,
  })
  @IsEnum(Measure)
  measure: Measure;
}
