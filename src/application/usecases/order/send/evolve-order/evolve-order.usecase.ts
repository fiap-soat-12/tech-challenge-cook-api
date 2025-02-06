import { Logger } from '@application/interfaces/logger.interface';
import { MessagePublisher } from '@application/interfaces/message-publisher.interface';
import { UUID } from '@application/types/UUID.type';
import { Order } from '@domain/entities/order';

export class EvolveOrderUseCase {
  constructor(
    private readonly messagePublisher: MessagePublisher<{ orderId: UUID }>,
    private readonly logger: Logger,
  ) {}

  async execute(orderDto: Order): Promise<void> {
    try {
      await this.messagePublisher.publish({ orderId: orderDto.id });
    } catch (error) {
      this.logger.log(
        `An error ocurrend in send message to evolve order ${error}`,
      );
      throw error;
    }
  }
}
