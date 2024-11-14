import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../common/DTOs/product.dto';
import { Customer } from '../database/entities/customer.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(customer: number, createProductDto: CreateProductDto): Promise<any> {
    const Customer = await this.customerRepository.findOne({
      where: { id: customer },
    })

    if (!Customer) {
      throw new NotFoundException(`customer with ID ${customer} not found`);
    }

    const createProduct: any = { customer, ...createProductDto };
    const newProduct = this.productsRepository.create(createProduct);
    return await this.productsRepository.save(newProduct);
  }

  async getAll(customerId: number): Promise<Product[]> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    })

    if (!customer) {
      throw new NotFoundException(`customer with ID ${customerId} not found`);
    }

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

  async delete(productId: number): Promise<any> {
    return await this.productsRepository.delete({ id: productId });
  }
}
