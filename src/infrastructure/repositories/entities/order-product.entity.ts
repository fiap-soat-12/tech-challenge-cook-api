import { UUID } from '@application/types/UUID.type';

export interface OrderProductEntity {
  productId: UUID;
  orderId: UUID;
  customization: string;
}
