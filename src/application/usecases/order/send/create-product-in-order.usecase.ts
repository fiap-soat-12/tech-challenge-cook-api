import { SendProductDto } from '@application/dto/send-product.dto';
import { MessagePublisher } from '@application/interfaces/message-publisher.interface';
import { Product } from '@domain/entities/product';

export class CreateProductInOrderUseCase {
  constructor(
    private readonly messagePublisher: MessagePublisher<SendProductDto>,
  ) {}

  async execute(productDto: Product): Promise<void> {
    await this.messagePublisher.publish({
      id: productDto.id,
      name: productDto.name,
      category: productDto.category.getValue(),
      description: productDto.description,
      price: productDto.price.getValue(),
      status: productDto.status.getValue(),
    });
  }
}
