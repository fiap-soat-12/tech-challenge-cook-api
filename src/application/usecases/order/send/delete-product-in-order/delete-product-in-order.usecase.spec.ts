import { ProductCategoryEnum } from '@application/enums/product-category.enum';
import { ProductStatusEnum } from '@application/enums/product-status.enum';
import { Logger } from '@application/interfaces/logger.interface';
import { MessagePublisher } from '@application/interfaces/message-publisher.interface';
import { UUID } from '@application/types/UUID.type';
import { Product } from '@domain/entities/product';
import { DeleteProductInOrderUseCase } from './delete-product-in-order.usecase';

describe('DeleteProductInOrderUseCase', () => {
  let useCase: DeleteProductInOrderUseCase;
  let mockMessagePublisher: jest.Mocked<MessagePublisher<{ id: UUID }>>;
  let mockLogger: jest.Mocked<Logger>;
  let productMock: Product;

  beforeEach(() => {
    mockMessagePublisher = {
      publish: jest.fn(),
    } as unknown as jest.Mocked<MessagePublisher<{ id: UUID }>>;

    mockLogger = {
      log: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    useCase = new DeleteProductInOrderUseCase(mockMessagePublisher, mockLogger);

    productMock = new Product({
      id: '123-uuid',
      name: 'Test Product',
      category: ProductCategoryEnum.DESSERT,
      price: 100,
      description: 'A test product',
      status: ProductStatusEnum.ACTIVE,
    });
  });

  it('should publish a message with the correct product ID', async () => {
    await useCase.execute(productMock);

    expect(mockMessagePublisher.publish).toHaveBeenCalledWith({
      id: '123-uuid',
    });

    expect(mockMessagePublisher.publish).toHaveBeenCalledTimes(1);
    expect(mockLogger.log).not.toHaveBeenCalled();
  });

  it('should log an error and rethrow it if the publish fails', async () => {
    const error = new Error('Failed to publish');
    mockMessagePublisher.publish.mockRejectedValue(error);

    await expect(useCase.execute(productMock)).rejects.toThrow(error);

    expect(mockMessagePublisher.publish).toHaveBeenCalledWith({
      id: '123-uuid',
    });

    expect(mockLogger.log).toHaveBeenCalledWith(
      `An error ocurrend in send message to delete order product ${error}`,
    );
  });
});
