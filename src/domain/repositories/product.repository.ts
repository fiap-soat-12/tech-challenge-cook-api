import { ProductStatusType } from '@application/types/product-status.type';
import { Product } from '@domain/entities/product';
import { PageCollection } from '@domain/models/page-collection';

export interface ProductRepository {
  create(product: Product): Promise<Product>;
  delete(id: string): Promise<Product>;
  update(product: Product): Promise<Product>;
  findById(id: string): Promise<Product>;
  findAll(): Promise<Product[]>;
  findAllByCategory(options: {
    category: string;
    status: ProductStatusType;
    page: number;
    size: number;
  }): Promise<PageCollection<Product> | null>;
}
