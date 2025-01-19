import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RouteService } from './route.service';
import { CreateRouteDto, UpdateRouteDto } from '../../common/DTOs/route.dto'; // Assuming CreateRouteDto exists in the specified path
import { Route } from '../../database/entities/route.entity';
import { Status } from '../../common/enums/route.enum';

@ApiTags('routes') // Used for Swagger UI
@Controller('routes')
@ApiBearerAuth('Authorization')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  /**
   * Create a new route
   * @param req
   * @param createRouteDto - The DTO containing the route data
   * @returns The newly created route
   */
  @Post()
  @ApiOperation({ summary: 'Create a new route' })
  async create(@Req() req, @Body() createRouteDto: CreateRouteDto): Promise<Route> {
    try {
      const { user: customer } = req;
      return this.routeService.create(customer.id, createRouteDto);
    } catch (error) {
      console.log(error);
    }
  }


  /**
   * Retrieves all routes based on the order ID and user details.
   *
   * @param {Request} req The request object containing user information.
   * @param {enum} status The type parameter used to filter routes.
   * @return {Promise<Route[]>} A promise that resolves to an array of Route objects.
   */
  @Get('all/:status')
  @ApiOperation({ summary: 'Get all routes by order ID' })
  @ApiResponse({ status: 200, description: 'The list of routes', })
  @ApiResponse({ status: 404, description: 'No routes found' })
  async getAll(
    @Req() req,
    @Param('status') status: Status
  ): Promise<Route[]> {
    const { user } = req;

    if (!Object.values(Status).includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    return this.routeService.getAll(user.id, user.role, status);
  }

  /**
   * Retrieves all routes based on the order ID and user details.
   *
   * @param {Request} req The request object containing user information.
   * @param {enum} status The type parameter used to filter routes.
   * @param customerId
   * @return {Promise<Route[]>} A promise that resolves to an array of Route objects.
   */
  @Get('all-routes/:customerId/:status')
  @ApiOperation({ summary: 'Get all routes by order ID' })
  @ApiResponse({ status: 200, description: 'The list of routes', })
  @ApiResponse({ status: 404, description: 'No routes found' })
  async getAllRoutes(
    @Req() req,
    @Param('status') status: Status,
    @Param('customerId') customerId: number
  ): Promise<Route[]> {

    if (!Object.values(Status).includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    return this.routeService.getAllRoutes(customerId, status);
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
   * @param req
   * @param routeId - The ID of the route to update
   * @param updateRouteDto - DTO containing the fields to update
   * @returns The updated route
   */
  @Put(':routeId')
  @ApiOperation({ summary: 'Update a route' })
  @ApiResponse({ status: 200, description: 'The updated route' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  @ApiBody({ type: Route, description: 'Fields to update in the route' })
  async update(
    @Req() req,
    @Param('routeId') routeId: number,
    @Body() updateRouteDto: UpdateRouteDto,
  ): Promise<Route> {
    return this.routeService.update(routeId, updateRouteDto);
  }


  /**
   * Delete a specific route by its ID
   * @param routeId - The ID of the route to delete
   * @returns A confirmation message
   */
  @Delete(':routeId')
  @ApiOperation({ summary: 'Delete a route by ID' })
  @ApiResponse({ status: 200, description: 'The route has been deleted' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  async delete(@Param('routeId') routeId: number): Promise<{ message: string }> {
    await this.routeService.delete(routeId);
    return { message: 'Route successfully deleted' };
  }
}
