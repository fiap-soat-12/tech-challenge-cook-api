import { OrderStatusEnum } from '@application/enums/order-status.enum';
import { UUID } from '@application/types/UUID.type';

export class CreateOrderDto {
  constructor(
    public readonly id: UUID,
    public readonly sequence: number,
    public readonly status: OrderStatusEnum,
    public readonly products: { id: string; customization: string }[],
  ) {}
}
