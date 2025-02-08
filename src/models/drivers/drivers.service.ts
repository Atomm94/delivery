import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from '../../database/entities/driver.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { CompleteDriverDataDto, RateDto, UpdateDataDto } from '../../common/DTOs/driver.dto';
import {
    completeDtoToPartialDriverEntity,
    updateDtoToPartialDriverEntity,
} from '../../common/helpers/dtoToPartialEntity';
import { Route } from '../../database/entities/route.entity';
import { Status } from '../../common/enums/route.enum';
import { Rate } from '../../database/entities/rate.entity';
import { Truck } from '../../database/entities/truck.entity';
import { GeoGateway } from '../geo/geo.gateway';

@Injectable()
export class DriversService {
    constructor(
        @InjectRepository(Driver)
        private readonly driverRepository: Repository<Driver>,
        @InjectRepository(Route)
        private readonly routeRepository: Repository<Route>,
        @InjectRepository(Rate)
        private readonly rateRepository: Repository<Rate>,
        @InjectRepository(Truck)
        private readonly truckRepository: Repository<Truck>,
        private readonly authService: AuthService,
        private readonly geoService: GeoGateway,
    ) {}


    async get(condition: any): Promise<Driver> {
        return await this.driverRepository.findOne({ where: condition });
    }

    async getAll(condition: any): Promise<Driver[]> {
        return await this.driverRepository.find({ where: condition });
    }

    async create(driverData: Partial<Driver>): Promise<Driver> {
        const driver = await this.driverRepository.findOne({
            where: { phone_number: driverData.phone_number }
        });

        if (driver) {
            throw new ConflictException('phone number is already exists');
        }

        driverData.password = await this.authService.hashPassword(driverData.password);

        return await this.driverRepository.save(driverData);
    }

    async complete(id: number, completeDataDto: CompleteDriverDataDto): Promise<Driver> {
        const updateData = completeDtoToPartialDriverEntity(completeDataDto);

        const { affected } = await this.driverRepository
            .createQueryBuilder()
            .update(Driver)
            .set(updateData)
            .where("id = :id", { id })
            .execute();

        if (!affected) {
            throw new NotFoundException('Driver not found');
        }

        return await this.driverRepository.findOneBy({ id });
    }

    async update(id: number, updateDataDto: UpdateDataDto): Promise<Driver> {
        const updateData = updateDtoToPartialDriverEntity(updateDataDto);

        const { affected } = await this.driverRepository
          .createQueryBuilder()
          .update(Driver)
          .set(updateData)
          .where("id = :id", { id })
          .execute();

        if (!affected) {
            throw new NotFoundException('Driver not found');
        }

        return await this.driverRepository.findOneBy({ id });
    }

    async getRate(driverId: number): Promise<any> {
        const driver = await this.driverRepository.findOne({ where: { id: driverId }, relations: ['ratings'] });

        if (!driver) {
            throw new NotFoundException('Driver is not found');
        }

        const rates: any[] = driver.ratings

        if (rates.length === 0) {
            return { averageRate: 0, rates };
        }

        const averageRate = rates.reduce((sum, rate) => sum + rate.star, 0) / rates.length;

        return { averageRate };
    }

    async startRoute(driverId: number, customerId: number, routeId: number, truckId: number): Promise<any> {
        const driver = await this.driverRepository.findOne({ where: { id: driverId } });

        if (!driver) {
            throw new NotFoundException('Driver is not found');
        }

        const truck: any = await this.truckRepository.createQueryBuilder('truck')
          .where('truck.id = :truckId', { truckId })
          .andWhere('truck.driverId = :driverId', { driverId })
          .getOne();

        if (!truck) {
            throw new NotFoundException('Truck is not found or is not attached to this Driver');
        }

        let route = await this.routeRepository.findOne({ where: { id: routeId, status: Status.ACTIVE } });

        if (!route) {
            throw new NotFoundException('Route is not found or not active');
        }

        await this.routeRepository.update(
          { id: routeId },
          { truck: { id: truckId }, status: Status.IN_PROGRESS as Status },
        );

       // await this.geoService.emitDriverLocation(driverId, customerId)

        route = await this.routeRepository.findOne({
            where: {
                id: routeId,
            },
            relations: [
                'orders',
                'orders.address',
                'orders.orderProducts.product',
            ],
        });

        if (route && route.orders)
        {
            route.orders = route.orders.map(order => {
                order.address.location = {
                    latitude: order.address.location.coordinates[0],
                    longitude: order.address.location.coordinates[1],
                };
                const products = order.orderProducts.map(orderProduct => {
                    return {
                        count: orderProduct.count,
                        price: orderProduct.price,
                        product: {
                            id: orderProduct.product.id,
                            name: orderProduct.product.name,
                            weight: orderProduct.product.weight,
                            length: orderProduct.product.length,
                            width: orderProduct.product.width,
                            height: orderProduct.product.height,
                            measure: orderProduct.product.measure,
                            type: orderProduct.product.type,
                        }
                    };
                });

                return {
                    ...order,
                    products,
                    orderProducts: undefined,
                };
            });
        }

        return { ...route, truck, driver };
    }
}
