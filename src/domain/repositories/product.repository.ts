import { Product } from '@domain/entities/product';
import { PageCollection } from '@domain/models/page-collection';

export interface ProductRepository {
  create(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
  update(product: Product): Promise<Product>;
  findById(id: string): Promise<Product>;
  findAll(): Promise<Product[]>;
  findAllByCategory(options: {
    category: string;
    page: number;
    size: number;
  }): Promise<PageCollection<Product> | null>;
}
