import { CompleteDriverDataDto, UpdateDataDto } from '../DTOs/driver.dto';
import { TruckDataDto } from '../DTOs/truck.dto';
import { CompleteCustomerDataDto, UpdateCustomerDataDto } from '../DTOs/customer.dto';
import { CreateRouteDto } from '../DTOs/route.dto';
import { CompleteCompanyDataDto, UpdateCompanyDataDto } from '../DTOs/company.dto';

export function completeDtoToPartialDriverEntity(dto: CompleteDriverDataDto) {
  return {
    email: dto.email,
    social_number: dto.social_number,
    license: dto.license,
    identity: dto.identity,
    op_state: dto.op_state,
    op_cities: dto.op_cities ? dto.op_cities : null,
    isVerified: true,
    porter: Boolean(Number(dto.porter)),
    second_porter: Boolean(Number(dto.second_porter)),
    third_porter: Boolean(Number(dto.third_porter)),
    emergency_driver: Boolean(Number(dto.emergency_driver)),
  };
}

export function completeDtoToPartialCompanyEntity(dto: CompleteCompanyDataDto) {
  return {
    phone_number: dto.phone_number,
    name: dto.name,
    email: dto.email,
    password: dto.password,
    ITN: dto.ITN,
    address: dto.address ? dto.address : null,
    owner: dto.owner,
    owner_social_number: dto.owner_social_number,
    city: dto.city ? dto.city : null,
    state: dto.state ? dto.state : null,
    zip_code: dto.zip_code ? dto.zip_code : null,
    op_state: dto.op_state ? dto.op_state : null,
    op_city: dto.op_city ? dto.op_city : null,
    contact_person_info: dto.contact_person_info ? dto.contact_person_info : null,
    isVerified: true
  };
}

export function updateDtoToPartialCompanyEntity(dto: UpdateCompanyDataDto) {
  return {
    name: dto.name,
    password: dto.password,
    email: dto.email,
  };
}

export function updateDtoToPartialDriverEntity(dto: UpdateDataDto) {
  return {
    firstName: dto.firstName,
    lastName: dto.lastName,
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
    insurance_photos: dto.insurance_photos ? dto.insurance_photos : null,
    insurance_files: dto.insurance_files ? dto.insurance_files : null,
    photos: dto.photos ? dto.photos : null
  };
}


export function DtoToPartialCustomerEntity(dto: CompleteCustomerDataDto) {
  return {
    company_address: dto.company_address,
    company_info: dto.company_info,
    contact_info: dto.contact_info,
    orgz_docs: dto.orgz_docs ? dto.orgz_docs : null,
    addresses: dto.addresses,
    isVerified: true,
  };
}

export function UpdateDtoToPartialCustomerEntity(dto: UpdateCustomerDataDto) {
  return {
    company_name: dto.company_name,
    email: dto.email,
    company_address: dto.company_address,
    company_info: dto.company_info,
    contact_info: dto.contact_info,
    orgz_docs: dto.orgz_docs ? dto.orgz_docs : null,
  };
}

// export function createRouteDtoToPartialRouteEntity(customer: number, dto: CreateRouteDto) {
//   return {
//     onloading_time: dto.onloading_time,
//     start_time: dto.start_time,
//     car_type: dto.car_type,
//     porter: dto.porter || null, // Assuming this can be null
//     status: dto.status || null,
//     addresses: dto.addresses || null,
//     items: dto.items.map(item => ({
//       name: item.name,
//       count: item.count,
//       price: item.price,
//       weight: item.weight,
//       length: item.length,
//       width: item.width,
//       height: item.height,
//       measure: item.measure || null,
//     })),
//     customer,
//   };
// }

