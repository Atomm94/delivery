import { Controller, Post, Body, Put, Param, Get, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../common/DTOs/order.dto';
import { Order } from '../database/entities/order.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
@ApiBearerAuth('Authorization')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Create a new order for the authenticated customer
  @Post()
  @ApiOperation({ summary: 'Create a new order for the authenticated customer' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
  })
  async create(
    @Request() req,  // Use the Request object to access req.user
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const { user: customer } = req;  // Extract customer from req.user
    return this.ordersService.create(customer.id, createOrderDto);  // Pass customer.id to service
  }

  // Get a specific order by ID for the authenticated customer
  @Get(':id')
  @ApiOperation({ summary: 'Get an order by its ID with routes, addresses, and products' })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully retrieved.',
  })
  async getOne(
    @Request() req,  // Use the Request object to access req.user
    @Param('id') id: number,
  ): Promise<Order> {
    return this.ordersService.getOne(id);  // Pass customer.id to service to validate ownership
  }

  // Get all orders for the authenticated customer
  @Get()
  @ApiOperation({ summary: 'Get all orders for the authenticated customer with their routes, addresses, and products' })
  @ApiResponse({
    status: 200,
    description: 'A list of orders for the customer with their associated routes, addresses, and products.',
  })
  async getAll(@Request() req): Promise<Order[]> {
    const { user: customer } = req;  // Extract customer from req.user
    return this.ordersService.getAll(customer.id);  // Pass customer.id to service
  }

  // Update an existing order by ID for the authenticated customer
  @Put(':id')
  @ApiOperation({ summary: 'Update an existing order by ID' })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully updated.',
  })
  async update(
    @Request() req,  // Use the Request object to access req.user
    @Param('id') id: number,
    @Body() updateOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto);  // Pass customer.id to service for validation
  }
}
