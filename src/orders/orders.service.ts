import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from '../database/entities/route.entity';
import { Repository } from 'typeorm';
import { CreateRouteDto } from '../common/DTOs/route.dto';
import { createRouteDtoToPartialRouteEntity } from '../common/helpers/dtoToPartialEntity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {}

  // Create a new route
  async create(customer: number, createRouteDto: CreateRouteDto): Promise<any> {
    const createRoute: any = Object.assign(customer, createRouteDto);
    const route = this.routeRepository.create(createRoute);
    return this.routeRepository.save(route);
  }

  // Find a single route by ID
  async getOne(id: number): Promise<Route> {
    const route = await this.routeRepository.findOne({ where: { id }, relations: ['addresses', 'products'] });
    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
    return route;
  }

  // Find all routes
  async getAll(customerId: number) {
    const routes = await this.routeRepository
      .createQueryBuilder('route')
      .andWhere('route.customer = :customerId', { customerId })
      .leftJoinAndSelect('route.addresses', 'addresses')
      .getMany();

    if (!routes.length) {
      throw new NotFoundException(`No routes found for customer with ID ${customerId}`);
    }

    return routes;
  }

  // Update an existing route
  async update(id: number, updateRouteDto: CreateRouteDto): Promise<Route> {
    const route = await this.getOne(id);
    Object.assign(route, updateRouteDto);
    return this.routeRepository.save(route);
  }
}
