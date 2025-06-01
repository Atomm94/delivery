import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ChangeStatusDto,
  CreateRouteDto,
  SearchByLocationDto,
  TakeRouteDto,
  UpdateRouteDto,
} from '../../common/DTOs/route.dto';
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
import { DriverStatusEnum } from '../../common/enums/driver-status.enum';
import { Company } from '../../database/entities/company.entity';

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

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,

    @InjectRepository(Truck)
    private readonly truckRepository: Repository<Truck>
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
      //TODO
      //order.verify_code = generateVerificationCode();
      order.verify_code = '123456';
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
  
  async getDriverRoutes(user: any, query: SearchByLocationDto): Promise<Route[]> {
    let routes: any;
    const { lat, long, radius, status } = query;

    console.log(query);

    const trucks: any = await this.driverRepository.findOne({where: {id: user.id}, relations: ['trucks']});
    if (!trucks) {
      throw new NotFoundException(`Driver with ID ${user.id} not found or can't find trucks`);
    }

    const searchRadius: number = radius * 1000 || 20 * 1000;
    const truckTypes = trucks.trucks.map(truck => truck.type);

    if (status === Status.INCOMING) {
      routes = await this.routeRepository
        .createQueryBuilder('route')
        .where('route.car_type IN (:...truckTypes) AND route.status = :status')
        .setParameters({ truckTypes, status })
        .innerJoinAndSelect('route.customer', 'customer')
        .leftJoinAndSelect('route.truck', 'truck')
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
              lat: lat,
              lng: long,
              radius: searchRadius,
            })
            .getQuery();
          return `EXISTS(${subQuery})`;
        })
        .orderBy('route.start_time', 'ASC')
        .getMany();
    } else {
      routes = await this.routeRepository
        .createQueryBuilder('route')
        .where('route.status = :status')
        .setParameters({ status })
        .innerJoinAndSelect('route.customer', 'customer')
        .leftJoinAndSelect('route.truck', 'truck')
        .leftJoinAndSelect('route.orders', 'order')
        .leftJoinAndSelect('order.orderProducts', 'orderProduct')
        .leftJoinAndSelect('orderProduct.product', 'product')
        .leftJoinAndSelect('order.address', 'orderAddress')
        .leftJoinAndSelect('route.loadAddresses', 'address')
        .orderBy('route.start_time', 'ASC')
        .getMany()
    }

    routes.forEach(route => {
      if (route.truck) {
        route['truckId'] = route.truck.id;
        route.truck = undefined;
      }
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
            driverId: user.id,
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
      if (route.truck) {
        route['truckId'] = route.truck.id;
        route.truck = undefined;
      }

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

      if (route.truck) {
        route['truckId'] = route.truck.id;
        route.truck = undefined;
      }

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

  async takeRoute(user: any, data: any): Promise<TakeRouteDto> {
    let driverId: number;
    switch (user.role) {
      case 'courier':
        const driver = await this.driverRepository.findOne({ where: { id: user.id, status: DriverStatusEnum.AVAILABLE as DriverStatusEnum } });

        if (!driver) {
          throw new NotFoundException('Driver is not found or is not available');
        }
        driverId = user.id;
        break;
      case 'company':
        const company = await this.companyRepository.findOne({ where: { id: user.id } });

        if (!company) {
          throw new NotFoundException('Company is not found');
        }

        driverId = data.driverId;

        const companyDriver = await this.driverRepository.findOne({ where: { id: driverId, company: user.id} });

        if (!companyDriver) {
          throw new NotFoundException('Driver is not found or not created by this company');
        }

        break;
    }

    const { truckId, routeId } = data;

    const truck: any = await this.truckRepository.createQueryBuilder('truck')
      .where('truck.id = :truckId', { truckId })
      .andWhere('truck.driverId = :driverId', { driverId })
      .getOne();

    if (!truck) {
      throw new NotFoundException('Truck is not found or is not attached to this Driver');
    }

    let route = await this.routeRepository.findOne({ where: { id: routeId } });

    if (!route) {
      throw new NotFoundException('Route is not found');
    }

    await this.routeRepository.update(
      { id: routeId },
      { truck: { id: truckId }, status: Status.ON_HOLD as Status },
    );

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

    return { ...route, ...truck, driver: await this.driverRepository.findOne({ where: { id: driverId } }) };
  }
}
