import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../database/entities/customer.entity';
import { Order } from '../database/entities/order.entity';
import { CreateOrderDto } from '../common/DTOs/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // Create a new route
  async create(customer: number, createOrderDto: CreateOrderDto): Promise<any> {
    const createOrder: any = { customer, ...createOrderDto };
    const order = this.orderRepository.create(createOrder);
    return await this.orderRepository.save(order);
  }

  // Find a single route by ID
  async getOne(id: number): Promise<Order> {
    const order =  await this.orderRepository
      .createQueryBuilder('order')
      .where('order.id = :id', { id })
      .leftJoinAndSelect('order.routes', 'route')  // Join routes
      .leftJoinAndSelect('route.address', 'address')  // Join address for each route
      .leftJoinAndSelect('route.product', 'product')  // Join product for each route
      .getOne();  // Get a single order

    if (!order) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
    return order;
  }

  // Find all routes
  async getAll(customerId: number) {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });

    if (!customer) {
      throw new NotFoundException('customer is not found');
    }

    return await this.orderRepository
      .createQueryBuilder('order')
      .where('order.customerId = :customerId', { customerId })  // Filter orders by customerId
      .leftJoinAndSelect('order.routes', 'route')  // Join routes
      .leftJoinAndSelect('route.address', 'address')  // Join address for each route
      .leftJoinAndSelect('route.product', 'product')  // Join product for each route
      .getMany();
  }

  // Update an existing route
  async update(id: number, updateOrderDto: CreateOrderDto): Promise<Order> {
    const order = await this.getOne(id);
    Object.assign(order, updateOrderDto);
    return await this.orderRepository.save(order);
  }
}
