import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SaveCardDto {
  @ApiProperty({ example: 'tok_visa', description: 'Stripe card token' })
  @IsString()
  @IsNotEmpty()
  tokenId: string;

  @ApiProperty({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  default?: boolean = true;
}
