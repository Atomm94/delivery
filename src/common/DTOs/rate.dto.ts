import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class RateDto {
  @ApiProperty({ example: 4.5, description: 'Rating star, must be a float value' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  star: number;

  @ApiProperty({ example: ['Service', 'Punctuality'], description: 'Type of the rate feedback as a string' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  type: string[];

  @ApiProperty({ example: 'Driver punctuality and professionalism', description: 'Detailed feedback for the rating' })
  @IsOptional()
  @IsString()
  feedback: string;
}