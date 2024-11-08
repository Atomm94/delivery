import { Body, Controller, Get, Param, Post, Put, Req, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../database/entities/product.entity';
import { CreateProductDto } from '../common/DTOs/product.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

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
}
