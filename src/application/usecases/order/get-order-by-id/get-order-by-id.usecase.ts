import { Logger } from '@application/interfaces/logger.interface';
import { UUID } from '@application/types/UUID.type';
import { Order } from '@domain/entities/order';
import { OrderRepository } from '@domain/repositories/order.repository';

export class GetOrderByIdUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly logger: Logger,
  ) {}

  async execute(id: UUID): Promise<Order> {
    try {
      this.logger.log(`Get order by id: ${id} started`);

      const order = await this.orderRepository.findById(id);

      return order;
    } catch (error) {
      this.logger.error(`Get order with id: ${id} failed`);
      throw new Error(`Failed to execute usecase error: ${error}`);
    }
  }
}
