import { CompleteDataDto } from '../DTOs/driver.dto';
import { Driver } from '../../database/entities/driver.entity';

export function dtoToPartialDriverEntity(dto: CompleteDataDto): Partial<Driver> {
  return {
    email: dto.email,
    social_number: dto.social_number,
    license: dto.license,
    identity: dto.identity,
    op_state: dto.op_state,
    op_cities: dto.op_cities ? dto.op_cities : null,
  };
}