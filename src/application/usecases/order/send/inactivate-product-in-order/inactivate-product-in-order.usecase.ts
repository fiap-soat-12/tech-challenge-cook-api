import { Logger } from '@application/interfaces/logger.interface';
import { MessagePublisher } from '@application/interfaces/message-publisher.interface';
import { UUID } from '@application/types/UUID.type';
import { Product } from '@domain/entities/product';

export class InactivateProductInOrderUseCase {
  constructor(
    private readonly messagePublisher: MessagePublisher<{ id: UUID }>,
    private readonly logger: Logger,
  ) {}

  async execute(productDto: Product): Promise<void> {
    try {
      await this.messagePublisher.publish({
        id: productDto.id,
      });
    } catch (error) {
      this.logger.log(
        `An error ocurrend in send message to inactivate order product ${error}`,
      );
      throw error;
    }
  }
}
