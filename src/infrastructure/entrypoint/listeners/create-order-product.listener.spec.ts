import { CreateOrderDto } from '@application/dto/create-order.dto';
import { Logger } from '@application/interfaces/logger.interface';
import { CreateOrderProductUseCase } from '@application/usecases/order/create-order/create-order.usecase';
import { SqsClient } from '@infrastructure/config/sqs-config/sqs.config';
import { CreateOrderProductListener } from './create-order-product.listener';

jest.mock('@infrastructure/config/sqs-config/sqs.config');

describe('CreateOrderProductListener', () => {
  let sqsClient: SqsClient;
  let createOrderUseCase: CreateOrderProductUseCase;
  let logger: Logger;
  let listener: CreateOrderProductListener;

  beforeEach(() => {
    sqsClient = new SqsClient();
    createOrderUseCase = {
      execute: jest.fn(),
    } as unknown as CreateOrderProductUseCase;
    logger = {
      log: jest.fn(),
      error: jest.fn(),
    } as unknown as Logger;

    listener = new CreateOrderProductListener(
      sqsClient,
      createOrderUseCase,
      logger,
    );
  });

  it('should initialize the listener on module init', () => {
    jest.spyOn(listener, 'listen').mockImplementation();
    listener.onModuleInit();

    expect(logger.log).toHaveBeenCalledWith('Start listening');
    expect(listener.listen).toHaveBeenCalled();
  });

  it('should handle message and call use case', async () => {
    const message: CreateOrderDto = {
      /* mock data */
    } as CreateOrderDto;
    await listener.handleMessage(message);

    expect(logger.log).toHaveBeenCalledWith(
      `Received message: ${JSON.stringify(message)}`,
      CreateOrderProductListener.name,
    );
    expect(createOrderUseCase.execute).toHaveBeenCalledWith(message);
  });

  it('should log error if use case execution fails', async () => {
    const message: CreateOrderDto = {
      /* mock data */
    } as CreateOrderDto;
    const error = new Error('Test error');
    jest.spyOn(createOrderUseCase, 'execute').mockRejectedValue(error);

    await listener.handleMessage(message);

    expect(logger.error).toHaveBeenCalledWith(
      `Error processing message: ${error}`,
    );
  });
});
