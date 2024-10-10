import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CardDto {
  @ApiProperty({
    example: '4035 5014 2814 6300',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  card_number: string;

  @ApiProperty({
    example: '07/26',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  card_date: string;

  @ApiProperty({
    example: '655',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  card_cvv: string;
}
