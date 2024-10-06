import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CardDto {
  @IsString()
  @IsNotEmpty()
  card_number: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  card_date: string;

  @IsString()
  @IsNotEmpty()
  card_cvv: string;
}
