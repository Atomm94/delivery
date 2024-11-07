import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RouteService } from './route.service';
import { CreateRouteDto } from '../common/DTOs/route.dto'; // Assuming CreateRouteDto exists in the specified path
import { Route } from '../database/entities/route.entity';

@ApiTags('routes') // Used for Swagger UI
@Controller('routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  /**
   * Create a new route
   * @param createRouteDto - The DTO containing the route data
   * @returns The newly created route
   */
  @Post()
  @ApiOperation({ summary: 'Create a new route' })
  @ApiResponse({ status: 201, description: 'The route has been successfully created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createRouteDto: CreateRouteDto): Promise<Route> {
    return this.routeService.create(createRouteDto);
  }

  /**
   * Get all routes for a specific order
   * @param orderId - The ID of the order
   * @returns An array of routes associated with the order
   */
  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get all routes by order ID' })
  @ApiResponse({ status: 200, description: 'The list of routes', })
  @ApiResponse({ status: 404, description: 'No routes found' })
  async getAll(@Param('orderId') orderId: number): Promise<Route[]> {
    return this.routeService.getAll(orderId);
  }

  /**
   * Get a specific route by its ID
   * @param routeId - The ID of the route
   * @returns The route details
   */
  @Get(':routeId')
  @ApiOperation({ summary: 'Get a route by ID' })
  @ApiResponse({ status: 200, description: 'The route details',})
  @ApiResponse({ status: 404, description: 'Route not found' })
  async getOne(@Param('routeId') routeId: number): Promise<Route> {
    return this.routeService.getOne(routeId);
  }

  /**
   * Update a route's details
   * @param routeId - The ID of the route to update
   * @param updateRouteDto - DTO containing the fields to update
   * @returns The updated route
   */
  @Put(':routeId')
  @ApiOperation({ summary: 'Update a route' })
  @ApiResponse({ status: 200, description: 'The updated route',})
  @ApiResponse({ status: 404, description: 'Route not found' })
  async update(
    @Param('routeId') routeId: number,
    @Body() updateRouteDto: Partial<Route>,
  ): Promise<Route> {
    return this.routeService.update(routeId, updateRouteDto);
  }
}
