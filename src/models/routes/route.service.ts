import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeStatusDto, CreateRouteDto, UpdateRouteDto } from '../../common/DTOs/route.dto';
import { Route } from '../../database/entities/route.entity';
import { Order } from '../../database/entities/order.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { Product } from '../../database/entities/product.entity';
import { Customer } from '../../database/entities/customer.entity';
import { Address } from '../../database/entities/address.entity';
import { PaymentStatus, Porter, Status } from '../../common/enums/route.enum';
import { OrderProduct } from '../../database/entities/orderProduct.entity';
import { ProductType } from '../../common/enums/product-type.enum';
import { RedisService } from '../../redis/redis.service';
import { Driver } from '../../database/entities/driver.entity';
import { Truck } from '../../database/entities/truck.entity';

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
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Truck)
    private readonly truckRepository: Repository<Truck>,
    private readonly redisService: RedisService
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
    }

    let createRouteData: any = { customer, ...modifiedRouteData };
    const createRoute: any = this.routeRepository.create(createRouteData);
    if (loadAddresses && loadAddresses.length > 0) {
      const addresses: any = await this.addressRepository.findByIds(loadAddresses);
      createRoute.loadAddresses = addresses
    }
    const saveRoute: any = await this.routeRepository.save(createRoute);

    for (const order of orders) {
      totalPrice += Number(order.price)
      order.route = saveRoute.id
      order.invoiceId = Number(order.invoiceId) || null
      const savedProducts: any = []

      for (const data of order.products) {
        let modifiedProduct: any
        const createProduct: any = data
        const { product } = createProduct
        const saveProduct: any = { customer, ...product };
        if (product.type === ProductType.PRODUCT as ProductType) {
          const { affected } = await this.productRepository.update({ id: product['id'] }, product)
          modifiedProduct = product
          if (!affected) {
            const newSaveProduct = await this.productRepository.create(saveProduct)
            modifiedProduct = await this.productRepository.save(newSaveProduct)
          }
        } else {
          const newSaveProduct = await this.productRepository.create(saveProduct)
          modifiedProduct = await this.productRepository.save(newSaveProduct)
        }
        savedProducts.push({
          price: data.price,
          count: data.count,
          product: modifiedProduct,
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

    return await this.getOne(routeId);
  }

  async changeStatus(routeId: number, changeStatusDto: ChangeStatusDto): Promise<any> {
    const route = await this.routeRepository.findOne({
      where: {
        id: routeId,
      },
    });

    if (!route) {
      throw new NotFoundException(`Route with ID ${routeId} not found`);
    }

    await this.routeRepository.createQueryBuilder()
      .update(Route)
      .set({ status: changeStatusDto.status })
      .where('id = :routeId', { routeId })
      .execute();

    return await this.getOne(routeId);
  }
  
  async getDriverRoutes(driverId: number, radius: number, status: Status): Promise<Route[]> {
    const redisClient = this.redisService.getClient();
    const driverLocation: any = await redisClient.get(driverId.toString());

    if (!driverLocation) {
      throw new NotFoundException('Driver location is not found');
    }
    const parsedLocation: any = JSON.parse(driverLocation);
    const searchRadius: number = radius * 1000 || 20 * 1000;
    let routes: any[]

    const trucks = await this.driverRepository.findOne({where: {id: driverId}, relations: ['trucks']});
    if (!trucks) {
      throw new NotFoundException(`Driver with ID ${driverId} not found or can't find trucks`);
    }
    const truckTypes = trucks.trucks.map(truck => truck.type);

    if (status === Status.IN_PROGRESS) {
        routes = await this.routeRepository
          .createQueryBuilder('route')
          .where('route.status = :status')
          .setParameters({ status: Status.IN_PROGRESS })
          .innerJoinAndSelect('route.customer', 'customer')
          .leftJoinAndSelect('route.orders', 'order')
          .leftJoinAndSelect('order.orderProducts', 'orderProduct')
          .leftJoinAndSelect('orderProduct.product', 'product')
          .leftJoinAndSelect('order.address', 'orderAddress')
          .leftJoinAndSelect('route.loadAddresses', 'address')
          .orderBy('route.start_time', 'ASC')
          .getMany()
    } else {
      routes = await this.routeRepository
        .createQueryBuilder('route')
        .where('route.car_type IN (:...truckTypes) AND route.status = :status')
        .setParameters({ truckTypes, status })
        .innerJoinAndSelect('route.customer', 'customer')
        .leftJoinAndSelect('route.orders', 'order')
        .leftJoinAndSelect('order.orderProducts', 'orderProduct')
        .leftJoinAndSelect('orderProduct.product', 'product')
        .leftJoinAndSelect('order.address', 'orderAddress')
        .leftJoinAndSelect('route.loadAddresses', 'address')
        .andWhere(qb => {
          const subQuery = qb.subQuery()
            .select('1')
            .from('route_load_addresses', 'rla')
            .innerJoin('Address', 'addr', 'addr.id = rla.addressId')
            .where('rla.routeId = route.id')
            .andWhere(
              `ST_DWithin(addr.location::geography, ST_SetSRID(ST_MakePoint(:lat, :lng)::geography, 4326), :radius)`,
            )
            .setParameters({
              lat: parsedLocation.lat,
              lng: parsedLocation.lng,
              radius: searchRadius,
            })
            .getQuery();
          return `EXISTS(${subQuery})`;
        })
        .orderBy('route.start_time', 'ASC')
        .getMany();
    }

    routes.forEach(route => {
      route.loadAddresses.map(address => {
        address.location = {
          latitude: address.location.coordinates[0],
          longitude: address.location.coordinates[1],
        };
      })

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

  async getCustomerRoutes(customerId: number, role, status: Status): Promise<any> {
    if (role !== UserRole.CUSTOMER) {
      throw new NotFoundException(`Only customers can get their routes.`);
    }

    const customer = await this.customerRepository.findOne({ where: { id: customerId } });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    const routes: any[] = await this.routeRepository
      .createQueryBuilder('route')
      .andWhere('route.customerId = :customerId AND route.status = :status', { customerId, status })
      .leftJoinAndSelect('route.orders', 'order')
      .leftJoinAndSelect('order.orderProducts', 'orderProduct')
      .leftJoinAndSelect('orderProduct.product', 'product')
      .leftJoinAndSelect('order.address', 'address')
      .leftJoinAndSelect('route.loadAddresses', 'Address')
      .leftJoinAndSelect('route.truck', 'truck')
      .orderBy('route.start_time', 'ASC')
      .getMany();

    routes.forEach(route => {
      route['truckId'] = route.truck.id;
      route.truck = undefined;

      route.loadAddresses.map(address => {
        address.location = {
          latitude: address.location.coordinates[0],
          longitude: address.location.coordinates[1],
        };
      })

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
          'loadAddresses',
          'truck'
        ],
      });

      route['truckId'] = route.truck.id;
      route.truck = undefined;

      route.loadAddresses.map(address => {
        address.location = {
          latitude: address.location.coordinates[0],
          longitude: address.location.coordinates[1],
        };
      })

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

  async getRoutesCountByMonth(customerId: number): Promise<number> {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    return await this.routeRepository
      .createQueryBuilder('route')
      .where('route.start_time >= :startOfMonth', { startOfMonth })
      .andWhere('route.start_time < :endOfMonth', { endOfMonth })
      .getCount();
  }
}
