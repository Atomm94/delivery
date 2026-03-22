import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBankTokenDto {
  @ApiProperty({ example: 'US', default: 'US' })
  @IsString()
  @IsNotEmpty()
  country: string = 'US';

  @ApiProperty({ example: 'usd', default: 'usd' })
  @IsString()
  @IsNotEmpty()
  currency: string = 'usd';

  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  account_holder_name: string;

  @ApiProperty({ example: 'individual', enum: ['individual', 'company'], default: 'individual' })
  @IsString()
  @IsIn(['individual', 'company'])
  @IsOptional()
  account_holder_type?: 'individual' | 'company' = 'individual';

  @ApiProperty({ example: '110000000', description: 'Routing number (US)' })
  @IsString()
  @IsNotEmpty()
  routing_number: string;

  @ApiProperty({ example: '000123456789', description: 'Account number' })
  @IsString()
  @IsNotEmpty()
  account_number: string;
}
