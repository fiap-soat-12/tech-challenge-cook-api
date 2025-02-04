import { Order } from '@domain/entities/order';

export interface OrderRepository {
  create(order: Order): Promise<Order>;
}
