import { UpdateProductDto } from '@application/dto/update-product.dto';
import { Logger } from '@application/interfaces/logger.interface';
import { Product } from '@domain/entities/product';
import { ProductNotFoundException } from '@domain/exceptions/product-not-found.exception';
import { ProductRepository } from '@domain/repositories/product.repository';

export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly logger: Logger,
  ) {}

  async execute(id: string, dto: UpdateProductDto): Promise<Product> {
    try {
      this.logger.log(`Update product by id: ${id} started`);

      const existingProduct = await this.productRepository.findById(id);

      if (!existingProduct) {
        throw new ProductNotFoundException(id);
      }

      const updatedProduct = new Product({
        description: dto.description || existingProduct.description,
        id: existingProduct.id,
        name: dto.name || existingProduct.name,
        price: dto.price || existingProduct.price.getValue(),
        status: existingProduct.status.getValue(),
        category: dto.category || existingProduct.category.getValue(),
      });

      await this.productRepository.update(updatedProduct);

      return updatedProduct;
    } catch (error) {
      this.logger.error(`Update product with id: ${id} failed`);
      throw new Error(`Failed to execute usecase error: ${error}`);
    }
  }
}
