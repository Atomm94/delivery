import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}


  async getAll(customerId: number): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .andWhere('route.customer = :customerId', { customerId })
      .getMany();
  }

  async getOne(productId: number): Promise<Product> {
    return this.productRepository.findOne({
      where: {
        id: productId,
      },
    });
  }

  async update(productId: number, updateProductDto: Partial<Product>): Promise<Product> {
    const product = await this.getOne(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }
}
