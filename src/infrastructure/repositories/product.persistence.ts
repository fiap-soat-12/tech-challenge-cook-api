import { Logger } from '@application/interfaces/logger.interface';
import { Product } from '@domain/entities/product';
import { ProductPersistenceError } from '@domain/exceptions/product-persistence-error.exception';
import { PageCollection } from '@domain/models/page-collection';
import { DatabaseConnection } from '@domain/repositories/database-connection';
import { ProductRepository } from '@domain/repositories/product.repository';

export class ProductPersistence implements ProductRepository {
  constructor(
    readonly connection: DatabaseConnection,
    private readonly logger: Logger,
  ) {}

  async findAllByCategory({
    category,
    page,
    size,
  }: {
    category: string;
    page: number;
    size: number;
  }): Promise<PageCollection<Product> | null> {
    const query = `
      SELECT * FROM product
      WHERE category = $1
    `;

    const { content, currentPage, pageSize, totalElements } =
      await this.connection.queryPaginate({
        statement: query,
        params: [category],
        page: page,
        size: size,
      });

    if (!totalElements) {
      return null;
    }

    return new PageCollection({
      currentPage,
      pageSize,
      totalElements,
      content: content.map((value) => new Product({ ...value })),
    });
  }

  async create(product: Product): Promise<void> {
    const now = new Date();
    const query = `
      INSERT INTO product (name, category, price, description, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const params = [
      product.name,
      product.category.getValue(),
      product.price.getValue(),
      product.description,
      product.status.getValue(),
      now,
      now,
    ];

    try {
      const result = await this.connection.query(query, params);

      if (!result) {
        throw new Error('Failed to create Product');
      }
    } catch (error) {
      this.logger.error(
        `Error creating product persist query: ${query}, params: ${params}`,
        error,
      );

      throw new ProductPersistenceError('Failed to create Product');
    }
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM product WHERE id = $1`;
    const params = [id];

    try {
      const result = await this.connection.query(query, params);

      if (!result) {
        throw new Error('Failed to delete Product');
      }
    } catch (error) {
      this.logger.error(
        `Error deleting product persist query: ${query}, params: ${params}`,
        error,
      );

      throw new ProductPersistenceError('Failed to delete Product');
    }
  }

  async update(product: Product): Promise<Product> {
    const now = new Date();
    const query = `
      UPDATE product
      SET name = $1, category = $2, price = $3, description = $4, status = $5, updated_at = $6
      WHERE id = $7
    `;
    const params = [
      product.name,
      product.category.getValue(),
      product.price.getValue(),
      product.description,
      product.status.getValue(),
      now,
      product.id,
    ];

    try {
      const result = await this.connection.query<Product>(query, params);

      if (!result) {
        throw new Error('Failed to update Product');
      }

      return result[0];
    } catch (error) {
      this.logger.error(
        `Error updating product persist query: ${query}, params: ${params}`,
        error,
      );
      throw new ProductPersistenceError('Failed to update Product');
    }
  }

  async findAll(): Promise<Product[]> {
    const query = `SELECT * FROM product`;

    try {
      const result = await this.connection.query(query);

      if (!result?.length) {
        return [];
      }

      return result.map((row) => new Product(row));
    } catch (error) {
      this.logger.error(
        `Error on getAll products persist query: ${query}`,
        error,
      );
      throw new ProductPersistenceError('Failed to fetch Products');
    }
  }

  async findById(id: string): Promise<Product | null> {
    const query = `SELECT * FROM product WHERE id = $1`;

    try {
      const result = await this.connection.query(query, [id]);

      if (!result) {
        return null;
      }

      return new Product(result[0]);
    } catch (error) {
      this.logger.error(
        `Error updating product persist query: ${query}, params: ${id}`,
        error,
      );
      throw new ProductPersistenceError(
        `Failed to fetch Product with id ${id}`,
      );
    }
  }
}
