import { CompleteDriverDataDto } from '../DTOs/driver.dto';

export function dtoToPartialDriverEntity(dto: CompleteDriverDataDto) {
  return {
    email: dto.email,
    social_number: dto.social_number,
    license: dto.license,
    identity: dto.identity,
    op_state: dto.op_state,
    op_cities: dto.op_cities ? dto.op_cities : null,
    porter: dto.porter,
    second_porter: dto.second_porter,
    third_porter: dto.third_porter,
    emergency_driver: dto.emergency_driver,
  };
}
