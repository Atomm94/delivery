import { Body, Controller, Get, Param, Post, Put, Req, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateRouteDto } from '../common/DTOs/route.dto';
import { Route } from '../database/entities/route.entity';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags( 'routes' )
@Controller('routes')
@ApiBearerAuth('Authorization')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST - Create a new route
  @Post()
  @ApiConsumes('multipart/form-data')
  async create(@Req() req, @Res() res, @Body() createRouteDto: CreateRouteDto): Promise<Route> {
    const { user: customer } = req;
    return res.send(await this.ordersService.create(customer.id, createRouteDto));
  }

  // GET - Retrieve a single route by ID
  @Get(':id')
  @ApiConsumes('multipart/form-data')
  async getOne(@Param('id') id: number, @Res() res): Promise<Route> {
    return res.send(await this.ordersService.getOne(id));
  }

  // GET - Retrieve all routes

  @Get()
  async getAll(@Req() req, @Res() res): Promise<Route[]> {
    const { user: customer } = req;
    return res.send(await this.ordersService.getAll(customer.id));
  }

  // PUT - Update an existing route
  @Put(':id')
  @ApiConsumes('multipart/form-data')
  async update(@Param('id') id: number, @Body() updateRouteDto: CreateRouteDto, @Res() res): Promise<Route> {
    return res.send(await this.ordersService.update(id, updateRouteDto));
  }
}
