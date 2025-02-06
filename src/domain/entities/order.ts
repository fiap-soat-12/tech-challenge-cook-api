import { OrderStatusEnum } from '@application/enums/order-status.enum';
import { OrderStatusType } from '@application/types/order-status.type';
import { OrderProduct } from './order-product';

interface OrderProps {
  id?: string;
  products: OrderProduct[];
  status: OrderStatusType;
  sequence: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order {
  public id: string;
  public sequence: number;
  public status: OrderStatus;
  public products: OrderProduct[];
  public createdAt: Date;
  public updatedAt: Date;

  constructor({ status, ...rest }: OrderProps) {
    Object.assign(this, rest);
    this.status = OrderStatus.create(status);
  }

  setStatus(status: OrderStatusType) {
    this.status = OrderStatus.create(status);
  }

  setStatusReady() {
    this.status = OrderStatus.create(OrderStatusEnum.READY);
  }

  setStatusFinished() {
    this.status = OrderStatus.create(OrderStatusEnum.FINISHED);
  }

  removeProducts() {
    this.products = [];
  }
}

class OrderStatus {
  private static readonly allowedStatuses: OrderStatusType[] =
    Object.values(OrderStatusEnum);

  private constructor(private readonly value: OrderStatusType) {}

  static create(status: OrderStatusType): OrderStatus {
    if (!OrderStatus.allowedStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    return new OrderStatus(status);
  }

  getValue(): OrderStatusType {
    return this.value;
  }
}
