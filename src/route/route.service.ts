import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from '../database/entities/route.entity';
import { CreateRouteDto } from '../common/DTOs/route.dto';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {}

  async create(createRouteDto: CreateRouteDto): Promise<any> {
    const createRoute: any = createRouteDto;
    const newRoute = this.routeRepository.create(createRoute);
    return await this.routeRepository.save(newRoute);
  }

  async getAll(orderId: number): Promise<Route[]> {
    return await this.routeRepository
      .createQueryBuilder('route')
      .andWhere('route.orderId = :orderId', { orderId })
      .getMany();
  }

  async getOne(routeId: number): Promise<Route> {
    return await this.routeRepository.findOne({
      where: {
        id: routeId,
      },
      relations: ['product', 'address'],
    });
  }

  async update(routeId: number, updateRouteDto: Partial<Route>): Promise<Route> {
    const route = await this.getOne(routeId);
    if (!route) {
      throw new Error('Route not found');
    }

    Object.assign(route, updateRouteDto);
    return await this.routeRepository.save(route);
  }
}
