import {IsEnum, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';


export class SignInDto {
  @IsNotEmpty({ message: 'phone number is required' })
  @IsString({ message: 'phone number must be a string' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'phone number must be a valid international phone number' })
  phone_number: string;

  @IsNotEmpty({ message: 'role is required' })
  @IsEnum(UserRole, { message: 'role must be either customer | company | courier' })
  role: UserRole;

  @IsNotEmpty({ message: 'password is required' })
  @IsString({ message: 'password must be a string' })
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  password: string;
}
