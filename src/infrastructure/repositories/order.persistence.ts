import { Logger } from '@application/interfaces/logger.interface';
import { Order } from '@domain/entities/order';
import { OrderProduct } from '@domain/entities/order-product';
import { OrderPersistenceError } from '@domain/exceptions/order-persistence.error';
import { DatabaseConnection } from '@domain/interface/database-connection.interface';
import { OrderRepository } from '@domain/repositories/order.repository';
import { OrderProductEntity } from './entities/order-product.entity';
import { OrderEntity } from './entities/order.entity';

export class OrderPersistence implements OrderRepository {
  constructor(
    private readonly connection: DatabaseConnection,
    private readonly logger: Logger,
  ) {}

  async create(order: Order): Promise<Order> {
    const now = new Date();
    const orderQuery = `
      INSERT INTO orders (sequence, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const orderParams = [order.sequence, order.status.getValue(), now, now];

    try {
      const orderResult = await this.connection.query<OrderEntity>(
        orderQuery,
        orderParams,
      );

      if (!orderResult || !orderResult.length) {
        throw new Error('Failed to create Order');
      }

      const {
        id: orderId,
        sequence: orderSequence,
        status: orderStatus,
      } = orderResult[0];

      await this.insertOrderProducts(orderId, order.products);

      return new Order({
        id: orderId,
        sequence: orderSequence,
        status: orderStatus,
        products: order.products.map(
          (product) => new OrderProduct(product.id, product.customization),
        ),
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      this.logger.error(
        `Error creating order persist query: ${orderQuery}, params: ${orderParams}`,
        error,
      );

      throw new OrderPersistenceError('Failed to create Order');
    }
  }

  private async insertOrderProducts(
    orderId: string,
    products: OrderProduct[],
  ): Promise<void> {
    const orderProductQueries = products.map((product) => {
      const productQuery = `
        INSERT INTO order_product (order_id, product_id, customization)
        VALUES ($1, $2, $3)
      `;
      const productParams = [orderId, product.id, product.customization];
      return this.connection.query<OrderProductEntity>(
        productQuery,
        productParams,
      );
    });

    await Promise.all(orderProductQueries);
  }
}
