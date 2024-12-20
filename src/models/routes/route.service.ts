import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRouteDto } from '../../common/DTOs/route.dto';
import { Route } from '../../database/entities/route.entity';
import { Order } from '../../database/entities/order.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { Product } from '../../database/entities/product.entity';
import { Customer } from '../../database/entities/customer.entity';
import { Address } from '../../database/entities/address.entity';
import { Porter } from '../../common/enums/route.enum';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(customer: number, createRouteDto: CreateRouteDto): Promise<any> {
    let totalPrice: number;
    const Customer = await this.customerRepository.findOne({
      where: { id: customer },
    })

    if (!Customer) {
      throw new NotFoundException(`customer with ID ${customer} not found`);
    }

    const { orders, loadAddresses, ...routeData } = createRouteDto;

    for (const loadAddress of loadAddresses) {
      const address = await this.addressRepository.findOne({
        where: { id: loadAddress },
      })

      if (!address) {
        throw new NotFoundException(`load address with ID ${loadAddress} not found`);
      }
    }

    for (const order of orders) {
      const address = await this.addressRepository.findOne({
        where: { id: order.address },
      })

      if (!address) {
        throw new NotFoundException(`shipping address with ID ${address} not found`);
      }
    }

    const modifiedRouteData = {
      start_time: routeData.start_time || null,
      car_type: routeData.car_type || null,
      porter: Porter[routeData.porter] || null,
    }

    let createRouteData: any = { customer, ...modifiedRouteData };
    const createRoute: any = this.routeRepository.create(createRouteData);
    const saveRoute: any = await this.routeRepository.save(createRoute);

    for (const order of orders) {
      totalPrice += order.price
      order.route = saveRoute.id
      order.products = this.productRepository.create(order.products)
      await this.productRepository.save(order.products as any)
    }

    await this.orderRepository.save(orders as any)

    const route = await this.routeRepository.findOne({ where: {id: saveRoute.id},
      relations: [
        'orders',
        'orders.address',
        'orders.products',
      ]
    });

    return {
      route,
      totalPrice,
    }
  }

  async getAll(userId: number, role): Promise<Route[]> {
    let query = 'route.customerId = :userId'
    if (role === UserRole.COURIER) {
      query = 'route.driverId = :userId'
    }

    return await this.routeRepository
      .createQueryBuilder('route')
      .andWhere(query, { userId })
      .leftJoinAndSelect('route.orders', 'order')
      .leftJoinAndSelect('order.products', 'products')
      .leftJoinAndSelect('order.address', 'address')
      .getMany();
  }

  async getOne(routeId: number): Promise<Route> {
    return await this.routeRepository.findOne({
      where: {
        id: routeId,
      },
      relations: [
        'orders',
        'orders.address',
        'orders.products',
      ],
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
