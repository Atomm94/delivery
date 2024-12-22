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
import { OrderProduct } from '../../database/entities/orderProduct.entity';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<any>,

    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(customer: number, createRouteDto: CreateRouteDto): Promise<any> {
    let totalPrice: number = 0;
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
      porter: Porter[routeData.porter] || Porter['1'],
    }

    let createRouteData: any = { customer, ...modifiedRouteData };
    const createRoute: any = this.routeRepository.create(createRouteData);
    const saveRoute: any = await this.routeRepository.save(createRoute);

    for (const order of orders) {
      totalPrice += Number(order.price)
      order.route = saveRoute.id
      const savedProducts: any = []

      for (const data of order.products) {
        console.log(data.product);
        savedProducts.push({
          price: data.price,
          count: data.count,
          product: await this.productRepository.save(data.product),
        })
      }

      const {products, ...saveOrderData} = order
      const savedOrder: any = await this.orderRepository.save(saveOrderData as any)
      const savedOrderProducts = savedProducts.map(data => {
        this.orderProductRepository.save({ order: savedOrder.id, product: data.product.id, price: data.price, count: data.count })
      })
      await Promise.all(savedOrderProducts)
    }

    const route = await this.routeRepository.findOne({
      where: { id: saveRoute.id },
      relations: [
        'orders',
        'orders.address',
        'orders.orderProducts.product',
      ],
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
