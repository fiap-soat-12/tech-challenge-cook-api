import { Logger } from '@application/interfaces/logger.interface';
import { InactivateProductInOrderUseCase } from '@application/usecases/order/send/inactivate-product-in-order/inactivate-product-in-order.usecase';
import { ProductNotFoundException } from '@domain/exceptions/product-not-found.exception';
import { ProductRepository } from '@domain/repositories/product.repository';

export class InactivateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly deleteProductInOrderUseCase: InactivateProductInOrderUseCase,
    private readonly logger: Logger,
  ) {}

  async execute(id: string): Promise<void> {
    try {
      this.logger.log(`Delete product by id: ${id} started`);

      const product = await this.productRepository.findById(id);

      if (!product) {
        throw new ProductNotFoundException(id);
      }

      await this.productRepository.inactivate(id);
      this.logger.log(`Delete product with id ${id} successfully`);

      this.deleteProductInOrderUseCase.execute(product);
    } catch (error) {
      this.logger.error(`Delete product with id: ${id} failed`);

      if (error instanceof ProductNotFoundException) {
        throw error;
      }

      throw new Error(`Failed to execute usecase error: ${error}`);
    }
  }
}
