import { SendProductDto } from '@application/dto/send-product.dto';
import { Logger } from '@application/interfaces/logger.interface';
import { MessagePublisher } from '@application/interfaces/message-publisher.interface';
import { Product } from '@domain/entities/product';

export class CreateProductInOrderUseCase {
  constructor(
    private readonly messagePublisher: MessagePublisher<SendProductDto>,
    private readonly logger: Logger,
  ) {}

  async execute(productDto: Product): Promise<void> {
    try {
      await this.messagePublisher.publish({
        id: productDto.id,
        name: productDto.name,
        category: productDto.category.getValue(),
        description: productDto.description,
        price: productDto.price.getValue(),
        status: productDto.status.getValue(),
      });
    } catch (error) {
      this.logger.log(
        `An error ocurrend in send message to create order product ${error}`,
      );
      throw error;
    }
  }
}
