import { OrderProduct } from './order-product';

describe('OrderProduct', () => {
  it('should create an OrderProduct with given id and customization', () => {
    const id = 'product-123';
    const customization = 'A sample product';
    const orderProduct = new OrderProduct(id, customization);

    expect(orderProduct.id).toBe(id);
    expect(orderProduct.customization).toBe(customization);
  });
});
