import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RouteService } from './route.service';
import { ChangeStatusDto, CreateRouteDto, UpdateRouteDto } from '../../common/DTOs/route.dto'; // Assuming CreateRouteDto exists in the specified path
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
   * @param status
   * @param radius
   * @return {Promise<Route[]>} A promise that resolves to an array of Route objects.
   */
  @Get('driver')
  @ApiOperation({ summary: 'Get all routes by order ID' })
  @ApiResponse({ status: 200, description: 'The list of routes', })
  @ApiResponse({ status: 404, description: 'No routes found' })
  @ApiQuery({
    name: 'radius',
    required: false,
    description: 'radius in km, default is 20',
    type: Number,
  })
  async getDriverRoutes(
    @Req() req,
    @Query('status') status: Status,
    @Query('radius') radius: number = 20
  ): Promise<Route[]> {
    const { user } = req;

    if (!Object.values(Status).includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    return this.routeService.getDriverRoutes(user, radius, status);
  }

  /**
   * Retrieves all routes based on the order ID and user details.
   *
   * @param {Request} req The request object containing user information.
   * @param {enum} status The type parameter used to filter routes.
   * @return {Promise<Route[]>} A promise that resolves to an array of Route objects.
   */
  @Get('customer')
  @ApiOperation({ summary: 'Get all routes by order ID' })
  @ApiResponse({ status: 200, description: 'The list of routes', })
  @ApiResponse({ status: 404, description: 'No routes found' })
  async getCustomerRoutes(
    @Req() req,
    @Query('status') status: Status,
  ): Promise<Route[]> {

    const { user } = req;

    if (!Object.values(Status).includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    return this.routeService.getCustomerRoutes(user.id, user.role, status);
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
   * Update a route's details
   * @param req
   * @param routeId - The ID of the route to update
   * @param status
   * @returns The updated route
   */
  @Put('status/:routeId')
  @ApiOperation({ summary: 'Update status of the route' })
  @ApiResponse({ status: 200, description: 'The updated status of the route' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  @ApiBody({ type: ChangeStatusDto, description: 'Change status in the route' })
  async changeStatus(
    @Req() req,
    @Param('routeId') routeId: number,
    @Body() status: ChangeStatusDto,
  ): Promise<Route> {
    return this.routeService.changeStatus(routeId, status);
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

  @Get('month/count')
  @ApiBearerAuth('Authorization')
  async getCount(
    @Req() req,
    @Res() res,
  ) {
    try {
      const { user: customer } = req;

      const data = await this.routeService.getRoutesCountByMonth(customer.id);

      return res.json({ message: 'count', data });
    } catch (error) {

      return res.status(404).json({
        statusCode: 404,
        timestamp: new Date().toISOString(),
        message: error.message,
      })
    }
  }
}
