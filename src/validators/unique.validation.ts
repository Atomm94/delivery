import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { DriversService } from '../drivers/drivers.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsDriverPhoneNumberUnique implements ValidatorConstraintInterface {
  constructor(private readonly driversService: DriversService) {}

  async validate(phone_number: string, args: ValidationArguments) {
    console.log(phone_number);
    const driver = await this.driversService.get({ phone_number });
    return !driver;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Phone number $value already exists';
  }
}
