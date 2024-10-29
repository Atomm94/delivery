import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../common/DTOs/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(customer: number, createProductDto: CreateProductDto): Promise<any> {
    const createProduct: any = { customer, ...createProductDto };
    const newProduct = this.productsRepository.create(createProduct);
    return await this.productsRepository.save(newProduct);
  }

  async getAll(customerId: number): Promise<Product[]> {
    return await this.productsRepository
      .createQueryBuilder('product')
      .andWhere('product.customerId = :customerId', { customerId })
      .getMany();
  }

  async getOne(productId: number): Promise<Product> {
    return await this.productsRepository.findOne({
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
    return await this.productsRepository.save(product);
  }
}
