import { Logger } from '@application/interfaces/logger.interface';
import { Product } from '@domain/entities/product';
import { ProductNotFoundException } from '@domain/exceptions/product-not-found.exception';
import { ProductRepository } from '@domain/repositories/product.repository';

export class GetProductByIdUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly logger: Logger,
  ) {}

  async execute(id: string): Promise<Product> {
    try {
      this.logger.log(`Get product by id: ${id} started`);

      const product = await this.productRepository.findById(id);

      if (!product) {
        throw new ProductNotFoundException(id);
      }

      return product;
    } catch (error) {
      this.logger.error(`Get product with id: ${id} failed`);
      throw new Error(`Failed to execute usecase error: ${error}`);
    }
  }
}
