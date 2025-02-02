import { ProductStatusType } from '@application/types/product-status.type';
import { Product } from '@domain/entities/product';
import { PageCollection } from '@domain/models/page-collection';
import { ProductRepository } from '@domain/repositories/product.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryProductRepository implements ProductRepository {
  private products: Product[] = [];

  async findById(id: string): Promise<Product | null> {
    return this.products.find((product) => product.id === id) || null;
  }

  async findAll(): Promise<Product[]> {
    return [...this.products];
  }

  async create(product: Product): Promise<Product> {
    this.products.push(product);
    return product;
  }

  async delete(id: string): Promise<Product> {
    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) {
      throw new Error(`Product with id ${id} not found`);
    }

    this.products.splice(index, 1);
    return null;
  }

  async update(product: Product): Promise<Product> {
    const index = this.products.findIndex((p) => p.id === product.id);

    if (index === -1) {
      throw new Error(`Product with id ${product.id} not found`);
    }

    this.products[index] = product;

    return product;
  }

  async findAllByCategory(options: {
    category: string;
    status: ProductStatusType;
    page: number;
    size: number;
  }): Promise<PageCollection<Product> | null> {
    const { category, page, size } = options;

    const filteredProducts = this.products.filter(
      (product) => product.category.getValue() === category,
    );

    if (filteredProducts.length === 0) {
      return null;
    }

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return new PageCollection<Product>({
      content: paginatedProducts,
      totalElements: filteredProducts.length,
      pageSize: Math.ceil(filteredProducts.length / size),
      currentPage: page,
    });
  }
}
