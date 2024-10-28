import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../database/entities/product.entity';
import { CreateProductDto } from '../common/DTOs/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


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
