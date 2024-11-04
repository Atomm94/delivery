import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from '../database/entities/route.entity';
import { Repository } from 'typeorm';
import { CreateRouteDto } from '../common/DTOs/route.dto';
import { Customer } from '../database/entities/customer.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // Create a new route
  async create(customer: number, createRouteDto: CreateRouteDto): Promise<any> {
    const createRoute: any = { customer, ...createRouteDto };
    const route = this.routeRepository.create(createRoute);
    return await this.routeRepository.save(route);
  }

  // Find a single route by ID
  async getOne(id: number): Promise<Route> {
    const route = await this.routeRepository.findOne({ where: { id }, relations: ['addresses'] });
    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
    return route;
  }

  // Find all routes
  async getAll(customerId: number) {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });

    if (!customer) {
      throw new NotFoundException('customer is not found');
    }

    return await this.routeRepository
      .createQueryBuilder('route')
      .andWhere('route.customerId = :customerId', { customerId })
      .leftJoinAndSelect('route.addresses', 'addresses')
      .getMany();
  }

  // Update an existing route
  async update(id: number, updateRouteDto: CreateRouteDto): Promise<Route> {
    const route = await this.getOne(id);
    Object.assign(route, updateRouteDto);
    return await this.routeRepository.save(route);
  }
}
