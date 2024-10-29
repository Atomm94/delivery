import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../database/entities/product.entity';
import { CreateProductDto } from '../common/DTOs/product.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags( 'products' )
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post(':id')
  async create(@Param('id') customerId: number, @Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(customerId, createProductDto);
  }

  @Get('/all/:id')
  async getAll(@Param('customerId') customerId: number): Promise<Product[]> {
    return this.productsService.getAll(customerId);
  }

  @Get(':id')
  async getOne(@Param('productId') productId: number): Promise<Product> {
    return this.productsService.getOne(productId);
  }

  @Put(':id')
  async update(
    @Param('productId') productId: number,
    @Body() updateProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.update(productId, updateProductDto);
  }
}
