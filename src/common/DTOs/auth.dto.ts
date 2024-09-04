import {IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';


export class SignInDto {
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be a valid international phone number' }) // Example validation
  phone_number: string;

  @IsOptional() // Optional field
  @IsEnum(UserRole, { message: 'Role must be either user or admin' })
  role: UserRole;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
