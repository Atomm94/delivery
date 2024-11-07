import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsEnum, IsPostalCode } from 'class-validator';
import { AddressType } from '../../common/enums/address-type.enum';

export class CreateAddressDto {
  @ApiProperty({
    description: 'The name of the institution',
    example: 'University of Example',
  })
  @IsString()
  @IsOptional()
  institution_name: string;

  @ApiProperty({
    description: 'The address of the institution',
    example: '123 Main St, Example City, EX 12345',
  })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({
    description: 'The city of the institution',
    example: 'Example City',
  })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({
    description: 'The state of the institution',
    example: 'EX',
  })
  @IsString()
  @IsOptional()
  state: string;

  @ApiProperty({
    description: 'The zip code of the institution',
    example: '12345',
  })
  @IsPostalCode('any')  // Validation for zip code
  @IsOptional()
  zip_code: string;

  @ApiProperty({
    description: 'Indicates if the address is the main one',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  main: boolean = false;  // Default value

  @ApiProperty({
    description: 'The type of the address (e.g., load, shipping)',
    enum: AddressType,
    default: AddressType.LOAD,
  })
  @IsEnum(AddressType)
  @IsOptional()
  type: AddressType = AddressType.LOAD;  // Default value
}
