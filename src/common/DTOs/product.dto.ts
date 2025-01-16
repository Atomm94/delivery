import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Measure } from '../enums/product.enum';
import { ProductType } from '../enums/product-type.enum';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Sample Product',  // Example product name
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The weight of the product in kilograms',
    example: 5.0,  // Example weight (in kg)
  })
  @IsOptional()
  @IsNumber()
  weight: number;

  @ApiProperty({
    description: 'The length of the product in centimeters',
    example: 30,  // Example length (in cm)
  })
  @IsOptional()
  @IsNumber()
  length: number;

  @ApiProperty({
    description: 'The width of the product in centimeters',
    example: 20,  // Example width (in cm)
  })
  @IsOptional()
  @IsNumber()
  width: number;

  @ApiProperty({
    description: 'The height of the product in centimeters',
    example: 15,  // Example height (in cm)
  })
  @IsOptional()
  @IsNumber()
  height: number;

  @ApiProperty({
    description: 'The measure unit of the product',
    enum: Measure,
    example: Measure.BOTTLE,  // Example measure unit (e.g., bottle)
    nullable: true,  // Allow nullable value
  })
  @IsOptional()
  @IsEnum(Measure)
  measure: Measure | null = null;
}
