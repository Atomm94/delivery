import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRouteDto, UpdateRouteDto } from '../../common/DTOs/route.dto';
import { Route } from '../../database/entities/route.entity';
import { Order } from '../../database/entities/order.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { Product } from '../../database/entities/product.entity';
import { Customer } from '../../database/entities/customer.entity';
import { Address } from '../../database/entities/address.entity';
import { PaymentStatus, Porter, Status } from '../../common/enums/route.enum';
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
      invoiceId: Number(routeData.invoiceId) || null,
      payment: routeData.payment || PaymentStatus.NOT_PAYED,
      loadAddresses: loadAddresses.map(loadAddress => Number(loadAddress)) || [],
    }

    let createRouteData: any = { customer, ...modifiedRouteData };
    const createRoute: any = this.routeRepository.create(createRouteData);
    const saveRoute: any = await this.routeRepository.save(createRoute);

    for (const order of orders) {
      totalPrice += Number(order.price)
      order.route = saveRoute.id
      order.invoiceId = Number(order.invoiceId) || null
      const savedProducts: any = []

      for (const data of order.products) {
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

    createRouteData = { customer, ...modifiedRouteData, price: totalPrice };

    await this.routeRepository.update({id: saveRoute.id}, createRouteData)

    return await this.getOne(saveRoute.id);
  }

  async update(routeId: number, updateRouteData: UpdateRouteDto): Promise<any> {
    let totalPrice: number = 0;
    const route = await this.routeRepository.findOne({
      where: {
        id: routeId,
      },
    });

    if (!route) {
      throw new NotFoundException(`Route with ID ${routeId} not found`);
    }

    const { orders, loadAddresses, ...updateRoute } = updateRouteData;

    for (const loadAddress of loadAddresses) {
      const address = await this.addressRepository.findOne({
        where: { id: loadAddress },
      })

      if (!address) {
        throw new NotFoundException(`load address with ID ${loadAddress} not found`);
      }
    }

    for (const order of orders) {
      const { address } = order;
      totalPrice += Number(order['price'])
      const modifiedAddressData: any = address

      modifiedAddressData.location = {
        type: 'Point',
        coordinates: [modifiedAddressData['location']['latitude'], modifiedAddressData['location']['longitude']],
      }

      await this.addressRepository.update({ id: address['id'] }, modifiedAddressData)
      for (const products of order['products'] as any[]) {
        const { count, price, product: { id, ...productData } } = products;
        await this.productRepository.update({ id }, productData)
        const { affected } = await this.orderProductRepository.update({ product: id }, { count, price })
        if (!affected) {
          const newOrderProduct = await this.orderProductRepository.create({ product: id, order: order['id'], count, price })
          await this.orderProductRepository.save(newOrderProduct)
        }
      }

      await this.orderRepository.update({ id: order['id'] }, {  onloading_time: order['onloading_time'], price: order['price'], invoiceId: Number(order['invoiceId']) })
    }

    await this.routeRepository.update({ id: routeId }, {
      start_time: updateRouteData.start_time || null,
      car_type: updateRouteData.car_type || null,
      status: updateRoute.status as Status || Status.INCOMING,
      porter: Porter[updateRouteData.porter] || Porter['1'],
      invoiceId: Number(updateRouteData.invoiceId) || null,
      payment: updateRoute.payment as PaymentStatus || PaymentStatus.NOT_PAYED,
      loadAddresses: loadAddresses.map(loadAddress => Number(loadAddress)) || [],
      price: totalPrice,
    })

    return await this.getOne(routeId);
  }
  
  async getAll(userId: number, role, status: Status): Promise<Route[]> {
    let query = 'route.customerId = :userId AND route.status = :status';
    if (role === UserRole.COURIER) {
      query = 'route.driverId = :userId AND route.status = :status';
    }

    const routes = await this.routeRepository
      .createQueryBuilder('route')
      .andWhere(query, { userId, status })
      .leftJoinAndSelect('route.orders', 'order')
      .leftJoinAndSelect('order.orderProducts', 'orderProduct')
      .leftJoinAndSelect('orderProduct.product', 'product')
      .leftJoinAndSelect('order.address', 'address')
      .orderBy('route.start_time', 'ASC')
      .getMany();

    routes.forEach(route => {
      if (route.orders) {
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
    });

    return routes;
  }

  async getOne(routeId: number): Promise<Route> {
      const route = await this.routeRepository.findOne({
        where: {
          id: routeId,
        },
        relations: [
          'orders',
          'orders.address',
          'orders.orderProducts.product',
        ],
      });

      if(route && route.orders)
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
          orderProducts: undefined, // Remove `orderProducts` if it's no longer needed
        };
      });
    }

    return route;
  }

  async delete(routeId: number): Promise<void> {
    const route = await this.getOne(routeId);
    if (!route) {
      throw new NotFoundException(`Route with ID ${routeId} not found`);
    }

    await this.routeRepository.delete(routeId);
  }
}
