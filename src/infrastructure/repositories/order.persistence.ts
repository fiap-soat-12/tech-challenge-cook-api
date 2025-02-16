import { Logger } from '@application/interfaces/logger.interface';
import { OrderStatusType } from '@application/types/order-status.type';
import { UUID } from '@application/types/UUID.type';
import { Order } from '@domain/entities/order';
import { OrderProduct } from '@domain/entities/order-product';
import { OrderPersistenceError } from '@domain/exceptions/order-persistence.exception';
import { DatabaseConnection } from '@domain/interface/database-connection.interface';
import { OrderRepository } from '@domain/repositories/order.repository';
import { OrderProductEntity } from './entities/order-product.entity';
import { OrderEntity } from './entities/order.entity';

export class OrderPersistence implements OrderRepository {
  constructor(
    private readonly connection: DatabaseConnection,
    private readonly logger: Logger,
  ) {}

  async updateStatus(id: UUID, status: OrderStatusType): Promise<Order | null> {
    const query = `
      UPDATE cook_order
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const params = [id, status];

    try {
      const resultOrder = await this.connection.query<OrderEntity>(
        query,
        params,
      );

      if (!resultOrder?.length) {
        return null;
      }

      const result = resultOrder[0];

      return await this.findById(result.id);
    } catch (error) {
      this.logger.error(
        `Error updating order status persist query: ${query}, params: ${params}`,
        error,
      );
      throw new OrderPersistenceError(
        `Failed to update Order status with id ${id}`,
      );
    }
  }

  async findById(id: UUID): Promise<Order | null> {
    const query = `
      SELECT
        o.id,
        o.sequence,
        o.status,
        o.created_at,
        o.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', op.id,
              'customization', op.customization
            )
          ) FILTER (WHERE op.id IS NOT NULL), '[]'
        ) AS products
      FROM cook_order o
      LEFT JOIN order_product op ON o.id = op.order_id
      WHERE o.id = $1
      GROUP BY o.id
    `;

    try {
      const resultOrder = await this.connection.query<OrderEntity>(query, [id]);

      if (!resultOrder?.length) {
        return null;
      }

      const result = resultOrder[0];

      return new Order({
        id: result.id,
        sequence: result.sequence,
        status: result.status,
        products: result.products.map(
          (product) => new OrderProduct(product.id, product.customization),
        ),
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      });
    } catch (error) {
      this.logger.error(
        `Error updating order persist query: ${query}, params: ${id}`,
        error,
      );
      throw new OrderPersistenceError(`Failed to fetch Order with id ${id}`);
    }
  }

  async create(order: Order): Promise<Order> {
    const orderQuery = `
      INSERT INTO cook_order (id, sequence, status, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING *
    `;
    const orderParams = [order.id, order.sequence, order.status.getValue()];

    try {
      const orderResult = await this.connection.query<OrderEntity>(
        orderQuery,
        orderParams,
      );

      if (!orderResult?.length) {
        throw new Error('Failed to create Order');
      }

      const {
        id: orderId,
        sequence: orderSequence,
        status: orderStatus,
        createdAt,
        updatedAt,
      } = orderResult[0];

      await this.insertOrderProducts(orderId, order.products);

      return new Order({
        id: orderId,
        sequence: orderSequence,
        status: orderStatus,
        products: order.products.map(
          (product) => new OrderProduct(product.id, product.customization),
        ),
        createdAt,
        updatedAt,
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
        INSERT INTO order_product (order_id, product_id, customization, created_at)
        VALUES ($1, $2, $3, NOW())
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
