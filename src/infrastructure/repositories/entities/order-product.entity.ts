import { UUID } from '@application/types/UUID.type';

export interface OrderProductEntity {
  id: UUID;
  productId: UUID;
  orderId: UUID;
  customization: string;
}
