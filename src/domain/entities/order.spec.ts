import { OrderStatusEnum } from '@application/enums/order-status.enum';
import { ProductCategoryEnum } from '@application/enums/product-category.enum';
import { ProductStatusEnum } from '@application/enums/product-status.enum';
import { Order } from './order';
import { Product } from './product';

describe('Order', () => {
  const product = new Product({
    id: '1',
    name: 'Product 1',
    price: 100,
    category: ProductCategoryEnum.MAIN_COURSE,
    description: 'Description 1',
    status: ProductStatusEnum.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  it('should create an order with valid properties', () => {
    const order = new Order({
      sequence: 1,
      status: OrderStatusEnum.RECEIVED,
      products: [product],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(order.status.getValue()).toBe(OrderStatusEnum.RECEIVED);
    expect(order.products).toEqual([product]);
  });

  it('should set status to READY', () => {
    const order = new Order({
      sequence: 1,
      status: OrderStatusEnum.RECEIVED,
      products: [product],
    });

    order.setStatusReady();
    expect(order.status.getValue()).toBe(OrderStatusEnum.READY);
  });

  it('should set status to FINISHED', () => {
    const order = new Order({
      sequence: 1,
      status: OrderStatusEnum.RECEIVED,
      products: [product],
    });

    order.setStatusFinished();
    expect(order.status.getValue()).toBe(OrderStatusEnum.FINISHED);
  });

  it('should remove all products', () => {
    const order = new Order({
      sequence: 1,
      status: OrderStatusEnum.RECEIVED,
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
