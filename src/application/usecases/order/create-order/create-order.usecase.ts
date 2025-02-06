import { CreateOrderDto } from '@application/dto/create-order.dto';
import { OrderStatusEnum } from '@application/enums/order-status.enum';
import { UUID } from '@application/types/UUID.type';
import { GetProductByIdUseCase } from '@application/usecases/products/get-product-by-id/get-product-by-id.usecase';
import { Order } from '@domain/entities/order';
import { OrderAlreadyExistsException } from '@domain/exceptions/order-already-exists.exception';
import { OrderRepository } from '@domain/repositories/order.repository';
import { Logger } from '@nestjs/common';
import { GetOrderByIdUseCase } from '../get-order-by-id/get-order-by-id.usecase';

export class CreateOrderProductUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly logger: Logger,
  ) {}

  async execute(dto: CreateOrderDto): Promise<Order> {
    try {
      this.logger.log('Create Order Cook start:');

      await this.checkIfOrderExists(dto.id);

      await this.checkIfProductsExists(dto.products);

      const order = new Order({
        id: dto.id,
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

  private async checkIfProductsExists(
    products: { id: string; customization: string }[],
  ) {
    for (const product of products) {
      const productFound = await this.getProductByIdUseCase.execute(product.id);

      if (!productFound) {
        throw new Error(`Product with id ${product.id} not found`);
      }
    }
  }

  private async checkIfOrderExists(id: UUID): Promise<void> {
    const orderFound = await this.getOrderByIdUseCase.execute(id);

    if (orderFound) {
      throw new OrderAlreadyExistsException(
        `Order with id ${id} already exists`,
      );
    }
  }
}
