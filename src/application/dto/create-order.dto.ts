import { OrderStatusEnum } from '@application/enums/order-status.enum';

export class CreateOrderDto {
  constructor(
    public readonly sequence: number,
    public readonly status: OrderStatusEnum,
    public readonly products: { id: string; customization: string }[],
  ) {}
}
