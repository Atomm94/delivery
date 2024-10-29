import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateRouteDto } from '../common/DTOs/route.dto';
import { Route } from '../database/entities/route.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags( 'routes' )
@Controller('routes')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST - Create a new route
  @Post(':id')
  async create(@Param('id') id: number, @Body() createRouteDto: CreateRouteDto, @Res() res): Promise<Route> {
    return res.send(await this.ordersService.create(id, createRouteDto));
  }

  // GET - Retrieve a single route by ID
  @Get(':id')
  async getOne(@Param('id') id: number, @Res() res): Promise<Route> {
    return res.send(await this.ordersService.getOne(id));
  }

  // GET - Retrieve all routes

  @Get('/all/:id')
  async getAll(@Param('id') id: number, @Res() res): Promise<Route[]> {
    return res.send(await this.ordersService.getAll(id));
  }

  // PUT - Update an existing route
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateRouteDto: CreateRouteDto, @Res() res): Promise<Route> {
    return res.send(await this.ordersService.update(id, updateRouteDto));
  }
}
