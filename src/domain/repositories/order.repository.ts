import { UUID } from '@application/types/UUID.type';
import { Order } from '@domain/entities/order';

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: UUID): Promise<Order>;
}
