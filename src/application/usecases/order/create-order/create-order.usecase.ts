import { CreateOrderDto } from '@application/dto/create-order.dto';
import { OrderStatusEnum } from '@application/enums/order-status.enum';
import { Order } from '@domain/entities/order';
import { OrderRepository } from '@domain/repositories/order.repository';
import { Logger } from '@nestjs/common';

export class CreateOrderProductUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly logger: Logger,
  ) {}

  async execute(dto: CreateOrderDto): Promise<Order> {
    try {
      this.logger.log('Create product start:');

      const order = new Order({
        sequence: dto.sequence,
        products: dto.products,
        status: OrderStatusEnum.PREPARING,
      });

      const orderCreated = await this.orderRepository.create(order);

      return orderCreated;
    } catch (error) {
      this.logger.error(`Create order failed`, error);

      throw new Error(`Failed to execute usecase error: ${error}`);
    }
  }
}
