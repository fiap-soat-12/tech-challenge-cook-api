import { OrderStatusEnum } from '@application/enums/order-status.enum';
import { Logger } from '@application/interfaces/logger.interface';
import { Order } from '@domain/entities/order';
import { OrderRepository } from '@domain/repositories/order.repository';
import { UpdateOrderStatusUseCase } from './update-order-status.usecase';

jest.mock('@domain/repositories/order.repository');

describe('UpdateOrderStatusUseCase', () => {
  let orderRepository: OrderRepository;
  let logger: Logger;
  let useCase: UpdateOrderStatusUseCase;

  beforeEach(() => {
    orderRepository = {
      findById: jest.fn(),
      updateStatus: jest.fn(),
    } as unknown as OrderRepository;
    logger = {
      log: jest.fn(),
      error: jest.fn(),
    } as unknown as Logger;

    useCase = new UpdateOrderStatusUseCase(orderRepository, logger);
  });

  it('should update an order status to READY successfully', async () => {
    const orderId = '123';
    const existingOrder = new Order({
      id: orderId,
      sequence: 1,
      products: [],
      status: OrderStatusEnum.PREPARING,
    });
    jest.spyOn(orderRepository, 'findById').mockResolvedValue(existingOrder);
    jest.spyOn(orderRepository, 'updateStatus').mockResolvedValue(undefined);

    const result = await useCase.execute(orderId, OrderStatusEnum.READY);

    expect(logger.log).toHaveBeenCalledWith(
      `Update order status to ready by id: ${orderId} started`,
    );
    expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
    expect(orderRepository.updateStatus).toHaveBeenCalledWith(
      orderId,
      OrderStatusEnum.READY,
    );
    expect(logger.log).toHaveBeenCalledWith(
      `Order with id: ${orderId} updated to ready`,
    );
    expect(result).toEqual(existingOrder);
  });

  it('should throw OrderNotFoundException if order does not exist', async () => {
    const orderId = '123';
    jest.spyOn(orderRepository, 'findById').mockResolvedValue(null);

    await expect(
      useCase.execute(orderId, OrderStatusEnum.READY),
    ).rejects.toThrow(Error);
  });

  it('should log an error and throw if something goes wrong', async () => {
    const orderId = '123';
    const error = new Error('Unexpected error');
    jest.spyOn(orderRepository, 'findById').mockRejectedValue(error);

    await expect(
      useCase.execute(orderId, OrderStatusEnum.READY),
    ).rejects.toThrowError(`Failed to execute usecase error: ${error}`);
    expect(logger.error).toHaveBeenCalledWith(
      `Update order status to ready with id: ${orderId} failed`,
    );
  });
});
