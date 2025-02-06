import { Logger } from '@application/interfaces/logger.interface';
import { UUID } from '@application/types/UUID.type';
import { Order } from '@domain/entities/order';
import { OrderRepository } from '@domain/repositories/order.repository';
import { GetOrderByIdUseCase } from './get-order-by-id.usecase';

jest.mock('@domain/repositories/order.repository');

describe('GetOrderByIdUseCase', () => {
  let orderRepository: OrderRepository;
  let logger: Logger;
  let useCase: GetOrderByIdUseCase;

  beforeEach(() => {
    orderRepository = {
      findById: jest.fn(),
    } as unknown as OrderRepository;
    logger = {
      log: jest.fn(),
      error: jest.fn(),
    } as unknown as Logger;

    useCase = new GetOrderByIdUseCase(orderRepository, logger);
  });

  it('should retrieve an order successfully', async () => {
    const id: UUID = '123' as UUID;
    const order = new Order({
      id,
      sequence: 1,
      products: [],
      status: 'PREPARING',
    });
    jest.spyOn(orderRepository, 'findById').mockResolvedValue(order);

    const result = await useCase.execute(id);

    expect(logger.log).toHaveBeenCalledWith(`Get order by id: ${id} started`);
    expect(orderRepository.findById).toHaveBeenCalledWith(id);
    expect(result).toEqual(order);
  });

  it('should log an error and throw if something goes wrong', async () => {
    const id: UUID = '123' as UUID;
    const error = new Error('Unexpected error');
    jest.spyOn(orderRepository, 'findById').mockRejectedValue(error);

    await expect(useCase.execute(id)).rejects.toThrowError(
      `Failed to execute usecase error: ${error}`,
    );
    expect(logger.error).toHaveBeenCalledWith(
      `Get order with id: ${id} failed`,
    );
  });
});
