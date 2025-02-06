import { CreateOrderDto } from '@application/dto/create-order.dto';
import { OrderStatusEnum } from '@application/enums/order-status.enum';
import { UUID } from '@application/types/UUID.type';
import { GetProductByIdUseCase } from '@application/usecases/products/get-product-by-id/get-product-by-id.usecase';
import { Order } from '@domain/entities/order';
import { OrderRepository } from '@domain/repositories/order.repository';
import { Logger } from '@nestjs/common';
import { GetOrderByIdUseCase } from '../get-order-by-id/get-order-by-id.usecase';
import { CreateOrderProductUseCase } from './create-order.usecase';

jest.mock(
  '@application/usecases/products/get-product-by-id/get-product-by-id.usecase',
);
jest.mock('@domain/repositories/order.repository');
jest.mock('../get-order-by-id/get-order-by-id.usecase');

describe('CreateOrderProductUseCase', () => {
  let orderRepository: OrderRepository;
  let getProductByIdUseCase: GetProductByIdUseCase;
  let getOrderByIdUseCase: GetOrderByIdUseCase;
  let logger: Logger;
  let useCase: CreateOrderProductUseCase;

  beforeEach(() => {
    orderRepository = {
      create: jest.fn(),
    } as unknown as OrderRepository;
    getProductByIdUseCase = {
      execute: jest.fn(),
    } as unknown as GetProductByIdUseCase;
    getOrderByIdUseCase = {
      execute: jest.fn(),
    } as unknown as GetOrderByIdUseCase;
    logger = {
      log: jest.fn(),
      error: jest.fn(),
    } as unknown as Logger;

    useCase = new CreateOrderProductUseCase(
      orderRepository,
      getProductByIdUseCase,
      getOrderByIdUseCase,
      logger,
    );
  });

  it('should create an order successfully', async () => {
    const dto: CreateOrderDto = {
      id: '123' as UUID,
      sequence: 1,
      products: [{ id: 'prod1', customization: 'extra cheese' }],
      status: OrderStatusEnum.RECEIVED,
    };

    jest.spyOn(getOrderByIdUseCase, 'execute').mockResolvedValue(null);
    jest.spyOn(getProductByIdUseCase, 'execute').mockResolvedValue(true as any);
    jest.spyOn(orderRepository, 'create').mockResolvedValue(new Order(dto));

    const result = await useCase.execute(dto);

    expect(logger.log).toHaveBeenCalledWith('Create Order Cook start:');
    expect(getOrderByIdUseCase.execute).toHaveBeenCalledWith(dto.id);
    expect(getProductByIdUseCase.execute).toHaveBeenCalledWith(
      dto.products[0].id,
    );
    expect(orderRepository.create).toHaveBeenCalledWith(expect.any(Order));
    expect(result).toBeInstanceOf(Order);
  });

  it('should throw an error if the order already exists', async () => {
    const dto: CreateOrderDto = {
      id: '123' as UUID,
      sequence: 1,
      products: [{ id: 'prod1', customization: 'extra cheese' }],
      status: OrderStatusEnum.RECEIVED,
    };
    jest
      .spyOn(getOrderByIdUseCase, 'execute')
      .mockResolvedValue(new Order(dto));

    await expect(useCase.execute(dto)).rejects.toThrow(Error);
  });

  it('should throw an error if a product does not exist', async () => {
    const dto: CreateOrderDto = {
      id: '123' as UUID,
      sequence: 1,
      products: [{ id: 'prod1', customization: 'extra cheese' }],
      status: OrderStatusEnum.RECEIVED,
    };
    jest.spyOn(getOrderByIdUseCase, 'execute').mockResolvedValue(null);
    jest.spyOn(getProductByIdUseCase, 'execute').mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(
      `Product with id prod1 not found`,
    );
  });

  it('should log an error and throw if something goes wrong', async () => {
    const dto: CreateOrderDto = {
      id: '123' as UUID,
      sequence: 1,
      products: [{ id: 'prod1', customization: 'extra cheese' }],
      status: OrderStatusEnum.RECEIVED,
    };
    const error = new Error('Unexpected error');
    jest.spyOn(getOrderByIdUseCase, 'execute').mockRejectedValue(error);

    await expect(useCase.execute(dto)).rejects.toThrowError(
      `Failed to execute usecase error: ${error}`,
    );
    expect(logger.error).toHaveBeenCalledWith('Create order failed', error);
  });
});
