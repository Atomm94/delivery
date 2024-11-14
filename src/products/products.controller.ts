import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../database/entities/product.entity';
import { CreateProductDto } from '../common/DTOs/product.dto';
import { ApiBearerAuth, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags( 'products' )
@Controller('products')
@ApiBearerAuth('Authorization')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Req() req, @Res() res, @Body() createProductDto: CreateProductDto): Promise<Product> {
    const { user: customer } = req;

    return res.send(await this.productsService.create(customer.id, createProductDto));
  }

  @Get()
  async getAll(@Req() req, @Res() res): Promise<Product[]> {
    const { user: customer } = req;

    return res.send(await this.productsService.getAll(customer.id));
  }

  @Get(':id')
  async getOne(@Param('id') productId: number, @Res() res): Promise<Product> {
    return res.send(await this.productsService.getOne(productId));
  }

  @Put(':id')
  async update(
    @Param('id') productId: number,
    @Body() updateProductDto: CreateProductDto,
    @Res() res
  ): Promise<Product> {
    return res.send(await this.productsService.update(productId, updateProductDto));
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found or not belonging to the customer',
  })
  async delete(
    @Param('id') productId: number,  // Capture productId from the route
    @Req() req: Request,  // Accessing the request object to get the customer (if applicable)
  ): Promise<void> {
    const result = await this.productsService.delete(productId);
    if (!result) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return result;  // If successful, return no content (status 204)
  }
}
