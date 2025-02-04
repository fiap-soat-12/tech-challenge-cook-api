import { OrderStatusType } from '@application/types/order-status.type';
import { UUID } from '@application/types/UUID.type';
import { OrderProductEntity } from './order-product.entity';

export interface OrderEntity {
  id?: UUID;
  products: OrderProductEntity[];
  status: OrderStatusType;
  sequence: number;
  createdAt: Date;
  updatedAt: Date;
}
