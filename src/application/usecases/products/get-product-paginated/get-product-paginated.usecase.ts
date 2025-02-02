import { ProductStatusEnum } from '@application/enums/product-status.enum';
import { Logger } from '@application/interfaces/logger.interface';
import { Product } from '@domain/entities/product';
import { PageCollection } from '@domain/models/page-collection';
import { ProductRepository } from '@domain/repositories/product.repository';

export class GetProductPaginatedUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly logger: Logger,
  ) {}

  async execute({
    category,
    page,
    size,
  }: {
    category: string;
    page: number;
    size: number;
  }): Promise<PageCollection<Product> | null> {
    try {
      this.logger.log(
        `Get products by Category: ${category}, Page: ${page}, Size: ${size} started`,
      );
      return await this.productRepository.findAllByCategory({
        category,
        page,
        size,
        status: ProductStatusEnum.ACTIVE,
      });
    } catch (error) {
      this.logger.error(
        `Get products by Category: ${category}, Page: ${page}, Size: ${size} failed`,
      );
      throw new Error(`Failed to execute usecase error: ${error}`);
    }
  }
}
