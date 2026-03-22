import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DobDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  day?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  month?: number;

  @ApiProperty({ example: 1990 })
  @IsOptional()
  @IsNumber()
  year?: number;
}

class AddressDto {
  @ApiProperty({ example: '123 Main St' })
  @IsOptional()
  @IsString()
  line1?: string;

  @ApiProperty({ example: 'Los Angeles' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'CA' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: '90001' })
  @IsOptional()
  @IsString()
  postal_code?: string;

  @ApiProperty({ example: 'US' })
  @IsOptional()
  @IsString()
  country?: string;
}

export class IndividualDto {
  @ApiProperty({ example: 'John' })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({ example: '0000', description: 'Last 4 digits of SSN' })
  @IsOptional()
  @IsString()
  ssn_last_4?: string;

  @ApiProperty({ type: DobDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => DobDto)
  dob?: DobDto;

  @ApiProperty({ example: '+15555551234' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'driver@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ type: AddressDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}

export class TosAcceptanceDto {
  @ApiProperty({ example: Math.floor(Date.now() / 1000), required: false })
  @IsOptional()
  @IsNumber()
  date?: number;

  @ApiProperty({ example: '127.0.0.1', required: false })
  @IsOptional()
  @IsString()
  ip?: string;
}

export class CompleteOnboardingDto {
  @ApiProperty({ description: 'Stripe connected account id; optional if already saved on driver' , required: false })
  @IsOptional()
  @IsString()
  accountId?: string;

  @ApiProperty({ description: 'Bank account token (e.g., from Stripe.js or mobile SDK)', example: 'btok_123', required: true })
  @IsNotEmpty()
  @IsString()
  tokenId: string;

  @ApiProperty({ type: IndividualDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => IndividualDto)
  individual?: IndividualDto;

  @ApiProperty({ type: TosAcceptanceDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => TosAcceptanceDto)
  tos_acceptance?: TosAcceptanceDto;
}
