import { OrderStatusType } from '@application/types/order-status.type';
import { UUID } from '@application/types/UUID.type';
import { Order } from '@domain/entities/order';

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: UUID): Promise<Order>;
  updateStatus(id: UUID, status: OrderStatusType): Promise<Order>;
}
