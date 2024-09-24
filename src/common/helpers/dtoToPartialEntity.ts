import { CompleteDriverDataDto, UpdateDataDto } from '../DTOs/driver.dto';
import { TruckDataDto } from '../DTOs/truck.dto';

export function completeDtoToPartialDriverEntity(dto: CompleteDriverDataDto) {
  return {
    email: dto.email,
    social_number: dto.social_number,
    license: dto.license,
    identity: dto.identity,
    op_state: dto.op_state,
    op_cities: dto.op_cities ? dto.op_cities : null,
    porter: Boolean(Number(dto.porter)),
    second_porter: Boolean(Number(dto.second_porter)),
    third_porter: Boolean(Number(dto.third_porter)),
    emergency_driver: Boolean(Number(dto.emergency_driver)),
  };
}

export function updateDtoToPartialDriverEntity(dto: UpdateDataDto) {
  return {
    firstName: dto.firstName,
    lastName: dto.lastName,
    phone_number: dto.phone_number,
    password: dto.password,
    email: dto.email,
    social_number: dto.social_number,
    license: dto.license,
    identity: dto.identity,
    op_state: dto.op_state,
    op_cities: dto.op_cities ? dto.op_cities : null,
    porter: Boolean(Number(dto.porter)),
    second_porter: Boolean(Number(dto.second_porter)),
    third_porter: Boolean(Number(dto.third_porter)),
    emergency_driver: Boolean(Number(dto.emergency_driver)),
  };
}

export function updateDtoToPartialTruckEntity(dto: TruckDataDto) {
  return {
    mark: dto.mark,
    model: dto.model,
    year: dto.year,
    vin_code: dto.vin_code,
    license_plate_number: dto.license_plate_number,
    max_capacity: Number(dto.max_capacity),
    length: Number(dto.length),
    width: Number(dto.width),
    height: Number(dto.height),
    type: dto.type,
    condition: dto.condition,
    vehicle_title: dto.vehicle_title ? dto.vehicle_title : null,
    insurances: dto.insurances ? dto.insurances : null,
    photos: dto.photos ? dto.photos : null
  };
}

