import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Measure } from '../../common/enums/product.enum';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Sample Product',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The weight of the product in kilograms',
    example: 5.0,
  })
  @IsOptional()
  @IsNumber()
  weight: number;

  @ApiProperty({
    description: 'The length of the product in centimeters',
    example: 30,
  })
  @IsOptional()
  @IsNumber()
  length: number;

  @ApiProperty({
    description: 'The width of the product in centimeters',
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  width: number;

  @ApiProperty({
    description: 'The height of the product in centimeters',
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  height: number;

  @ApiProperty({
    description: 'The measure unit of the product',
    enum: Measure,
  })
  @IsOptional()
  @IsEnum(Measure)
  measure: Measure;
}
