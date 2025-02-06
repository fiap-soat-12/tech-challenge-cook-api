import { OrderStatusEnum } from '@application/enums/order-status.enum';
import { Order } from './order';
import { OrderProduct } from './order-product';

describe('Order', () => {
  const product = new OrderProduct('1', 'customization');

  it('should create an order with valid properties', () => {
    const order = new Order({
      sequence: 1,
      status: OrderStatusEnum.PREPARING,
      products: [product],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(order.status.getValue()).toBe(OrderStatusEnum.PREPARING);
    expect(order.products).toEqual([product]);
  });

  it('should set status to READY', () => {
    const order = new Order({
      sequence: 1,
      status: OrderStatusEnum.PREPARING,
      products: [product],
    });

    order.setStatusReady();
    expect(order.status.getValue()).toBe(OrderStatusEnum.READY);
  });

  it('should set status to FINISHED', () => {
    const order = new Order({
      sequence: 1,
      status: OrderStatusEnum.PREPARING,
      products: [product],
    });

    order.setStatusFinished();
    expect(order.status.getValue()).toBe(OrderStatusEnum.FINISHED);
  });

  it('should remove all products', () => {
    const order = new Order({
      sequence: 1,
      status: OrderStatusEnum.PREPARING,
      products: [product],
    });

    order.removeProducts();
    expect(order.products).toEqual([]);
  });

  it('should throw error for invalid status', () => {
    expect(
      () =>
        new Order({
          sequence: 1,
          status: 'INVALID_STATUS' as any,
          products: [product],
        }),
    ).toThrow('Invalid status: INVALID_STATUS');
  });
});
