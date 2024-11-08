import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRouteDto } from '../common/DTOs/route.dto';
import { Route } from '../database/entities/route.entity';
import { Order } from '../database/entities/order.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { Product } from '../database/entities/product.entity';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(customer: number, createRouteDto: CreateRouteDto): Promise<any> {
    const { orders, loadAddresses, ...routeData } = createRouteDto;
    let createRouteData: any = { customer, ...routeData };
    const createRoute: any = this.routeRepository.create(createRouteData);
    const saveRoute: any = await this.routeRepository.save(createRoute);
    const savedOrdersData = []
    let productIds
    let addressId
    for (const order of orders) {
      order.routeId = saveRoute.id
      productIds = (await Promise.all(order.products.map(product => {
        return this.productRepository.save(product);
      }))).map(p => p.id)
      savedOrdersData.push(order);
    }

    console.log(orders);
    await this.orderRepository.save(orders);

    return await this.routeRepository.findOne({ where: {id: saveRoute.id}, relations: ['orders'] });
  }

  async getAll(userId: number, role): Promise<Route[]> {
    let query = 'route.customerId = :customerId'
    if (role === UserRole.COURIER) {
      query = 'route.driverId = :driverId'
    }

    return await this.routeRepository
      .createQueryBuilder('route')
      .andWhere(query, { userId })
      .leftJoinAndSelect('route.orders', 'order')
      .getMany();
  }

  async getOne(routeId: number): Promise<Route> {
    return await this.routeRepository.findOne({
      where: {
        id: routeId,
      },
      relations: ['orders'],
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
