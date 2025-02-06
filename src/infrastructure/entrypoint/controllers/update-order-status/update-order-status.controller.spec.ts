import { OrderStatusEnum } from '@application/enums/order-status.enum';
import { UUID } from '@application/types/UUID.type';
import { UpdateOrderToReadyUseCase } from '@application/usecases/order/update-order-to-ready/update-order-to-ready.usecase';
import { OrderNotFoundException } from '@domain/exceptions/order-not-found.exception';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateOrderStatusController } from './update-order-status.controller';

describe('UpdateOrderStatusController', () => {
  let controller: UpdateOrderStatusController;
  let useCase: UpdateOrderToReadyUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateOrderStatusController],
      providers: [
        {
          provide: UpdateOrderToReadyUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UpdateOrderStatusController>(
      UpdateOrderStatusController,
    );
    useCase = module.get<UpdateOrderToReadyUseCase>(UpdateOrderToReadyUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should update order status successfully', async () => {
    const orderId: UUID = 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11';
    const status: OrderStatusEnum = OrderStatusEnum.READY;

    jest.spyOn(useCase, 'execute').mockResolvedValueOnce(undefined);

    await expect(
      controller.updateOrderStatus(orderId, status),
    ).resolves.toBeUndefined();
    expect(useCase.execute).toHaveBeenCalledWith(orderId, status);
  });

  it('should throw HttpException with 404 when order is not found', async () => {
    const orderId: UUID = 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11';
    const status: OrderStatusEnum = OrderStatusEnum.READY;

    jest
      .spyOn(useCase, 'execute')
      .mockRejectedValueOnce(new OrderNotFoundException('Order not found'));

    await expect(controller.updateOrderStatus(orderId, status)).rejects.toThrow(
      new HttpException('Order with ID Order not found not found', 404),
    );
  });

  it('should throw HttpException with 500 on unknown error', async () => {
    const orderId: UUID = 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11';
    const status: OrderStatusEnum = OrderStatusEnum.READY;

    jest
      .spyOn(useCase, 'execute')
      .mockRejectedValueOnce(new Error('Unexpected error'));

    await expect(controller.updateOrderStatus(orderId, status)).rejects.toThrow(
      new HttpException('Unexpected error', 500),
    );
  });
});
