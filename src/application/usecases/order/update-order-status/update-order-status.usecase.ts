import { Logger } from '@application/interfaces/logger.interface';
import { OrderStatusType } from '@application/types/order-status.type';
import { Order } from '@domain/entities/order';
import { OrderNotFoundException } from '@domain/exceptions/order-not-found.exception';
import { OrderRepository } from '@domain/repositories/order.repository';

export class UpdateOrderStatusUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly logger: Logger,
  ) {}

  async execute(orderId: string, status: OrderStatusType): Promise<Order> {
    try {
      this.logger.log(
        `Update order status to ${status} by id: ${orderId} started`,
      );

      const existingOrder = await this.orderRepository.findById(orderId);

      if (!existingOrder) {
        throw new OrderNotFoundException(orderId);
      }

      await this.orderRepository.updateStatus(existingOrder.id, status);

      this.logger.log(`Order with id: ${orderId} updated to ${status}`);

      return existingOrder;
    } catch (error) {
      this.logger.error(
        `Update order status to ${status} with id: ${orderId} failed`,
      );
      throw new Error(`Failed to execute usecase error: ${error}`);
    }
  }
}
