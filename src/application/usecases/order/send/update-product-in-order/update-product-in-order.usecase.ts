import { SendProductDto } from '@application/dto/send-product.dto';
import { Logger } from '@application/interfaces/logger.interface';
import { MessagePublisher } from '@application/interfaces/message-publisher.interface';
import { Product } from '@domain/entities/product';

export class UpdateProductInOrderUseCase {
  constructor(
    private readonly messagePublisher: MessagePublisher<SendProductDto>,
    private readonly logger: Logger,
  ) {}

  async execute(productDto: Product): Promise<void> {
    try {
      await this.messagePublisher.publish({
        name: productDto.name,
        id: productDto.id,
        category: productDto.category.getValue(),
        description: productDto.description,
        price: productDto.price.getValue(),
        status: productDto.status.getValue(),
      });
    } catch (error) {
      this.logger.log(
        `An error ocurrend in send message to update order product ${error}`,
      );
      throw error;
    }
  }
}
