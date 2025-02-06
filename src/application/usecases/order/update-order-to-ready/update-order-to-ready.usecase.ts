import { OrderStatusEnum } from '@application/enums/order-status.enum';
import { Logger } from '@application/interfaces/logger.interface';
import { Order } from '@domain/entities/order';
import { OrderNotFoundException } from '@domain/exceptions/order-not-found.exception';
import { OrderRepository } from '@domain/repositories/order.repository';

export class UpdateOrderToReadyUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly logger: Logger,
  ) {}

  async execute(orderId: string): Promise<Order> {
    try {
      this.logger.log(`Update order status to ready by id: ${orderId} started`);

      const existingOrder = await this.orderRepository.findById(orderId);

      if (!existingOrder) {
        throw new OrderNotFoundException(orderId);
      }

      await this.orderRepository.updateStatus(
        existingOrder.id,
        OrderStatusEnum.READY,
      );

      this.logger.log(`Order with id: ${orderId} updated to ready`);

      return existingOrder;
    } catch (error) {
      this.logger.error(
        `Update order status to ready with id: ${orderId} failed`,
      );
      throw new Error(`Failed to execute usecase error: ${error}`);
    }
  }
}
