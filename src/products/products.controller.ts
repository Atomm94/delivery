import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../database/entities/product.entity';
import { CreateProductDto } from '../common/DTOs/product.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags( 'products' )
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post(':id')
  async create(@Param('id') customerId: number, @Body() createProductDto: CreateProductDto, @Res() res): Promise<Product> {
    return res.send(await this.productsService.create(customerId, createProductDto));
  }

  @Get('/all/:id')
  async getAll(@Param('customerId') customerId: number, @Res() res): Promise<Product[]> {
    return res.send(await this.productsService.getAll(customerId));
  }

  @Get(':id')
  async getOne(@Param('productId') productId: number, @Res() res): Promise<Product> {
    return res.send(await this.productsService.getOne(productId));
  }

  @Put(':id')
  async update(
    @Param('productId') productId: number,
    @Body() updateProductDto: CreateProductDto,
    @Res() res
  ): Promise<Product> {
    return res.send(await this.productsService.update(productId, updateProductDto));
  }
}
