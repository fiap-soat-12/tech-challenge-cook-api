import { CreateProductDto } from '@application/dto/create-product.dto';
import { ProductStatusEnum } from '@application/enums/product-status.enum';
import { Logger } from '@application/interfaces/logger.interface';
import { CreateProductInOrderUseCase } from '@application/usecases/order/send/create-product-in-order.usecase';
import { Product } from '@domain/entities/product';
import { ProductRepository } from '@domain/repositories/product.repository';

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly createProductInOrderUseCase: CreateProductInOrderUseCase,
    private readonly logger: Logger,
  ) {}

  async execute(dto: CreateProductDto): Promise<Product> {
    try {
      const product = new Product({
        category: dto.category,
        description: dto.description,
        name: dto.name,
        price: dto.price,
        status: ProductStatusEnum.ACTIVE,
      });

      this.logger.log('Create product start:');

      await this.productRepository.create(product);

      this.createProductInOrderUseCase.execute(product);

      return product;
    } catch (error) {
      this.logger.error(`Create product failed`, error);

      throw new Error(`Failed to execute usecase error: ${error}`);
    }
  }
}
