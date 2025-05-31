import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsEnum, IsPostalCode, IsNumber, IsNotEmpty } from 'class-validator';
import { AddressType } from '../enums/address-type.enum';
import { SearchByLocationDto, TakeRouteDto } from './route.dto';

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
    description: 'The latitude of the location (in decimal degrees)',
    type: Number,
    example: 40.712776,  // Example latitude (e.g., New York)
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    description: 'The longitude of the location (in decimal degrees)',
    type: Number,
    example: -74.005974,  // Example longitude (e.g., New York)
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({
    description: 'The type of the address (e.g., load, shipping)',
    enum: AddressType,
    default: AddressType.LOAD,
  })
  @IsEnum(AddressType)
  @IsOptional()
  type: AddressType = AddressType.LOAD;  // Default value

  @ApiProperty({
    description: 'Contact person associated with the address',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  contact_person: string | null;

  @ApiProperty({
    description: 'Contact phone number associated with the address',
    example: '123-456-7890',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone: string | null;
}

export class SearchNearDto extends OmitType(SearchByLocationDto, ['status'] as const){}