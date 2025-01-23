import { Logger } from '@application/interfaces/logger.interface';
import { Product } from '@domain/entities/product';
import { ProductRepository } from '@domain/repositories/product.repository';

export class GetProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly logger: Logger,
  ) {}

  async execute(): Promise<Product[]> {
    try {
      this.logger.error(`Get all product started`);
      const result = await this.productRepository.findAll();

      if (!result.length) {
        return null;
      }

      return result;
    } catch (error) {
      this.logger.error(`Get all product failed`);
      throw new Error(`Failed to execute usecase error: ${error}`);
    }
  }
}
