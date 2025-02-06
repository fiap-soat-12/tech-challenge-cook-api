import { SendProductDto } from '@application/dto/send-product.dto';
import { ProductCategoryEnum } from '@application/enums/product-category.enum';
import { ProductStatusEnum } from '@application/enums/product-status.enum';
import { Logger } from '@application/interfaces/logger.interface';
import { MessagePublisher } from '@application/interfaces/message-publisher.interface';
import { Product } from '@domain/entities/product';
import { UpdateProductInOrderUseCase } from './update-product-in-order.usecase';

describe('UpdateProductInOrderUseCase', () => {
  let useCase: UpdateProductInOrderUseCase;
  let mockMessagePublisher: jest.Mocked<MessagePublisher<SendProductDto>>;
  let mockLogger: jest.Mocked<Logger>;
  let productMock: Product;

  beforeEach(() => {
    mockMessagePublisher = {
      publish: jest.fn(),
    } as unknown as jest.Mocked<MessagePublisher<SendProductDto>>;

    mockLogger = {
      log: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    useCase = new UpdateProductInOrderUseCase(mockMessagePublisher, mockLogger);

    productMock = new Product({
      id: '123-uuid',
      name: 'Updated Product',
      category: ProductCategoryEnum.MAIN_COURSE,
      price: 200,
      description: 'An updated product',
      status: ProductStatusEnum.ACTIVE,
    });
  });

  it('should publish a message with the correct updated product data', async () => {
    await useCase.execute(productMock);

    expect(mockMessagePublisher.publish).toHaveBeenCalledWith({
      id: '123-uuid',
      name: 'Updated Product',
      category: 'MAIN_COURSE',
      price: 200,
      description: 'An updated product',
      status: 'ACTIVE',
    });

    expect(mockMessagePublisher.publish).toHaveBeenCalledTimes(1);
    expect(mockLogger.log).not.toHaveBeenCalled(); // Não deve logar erro em caso de sucesso
  });

  it('should log an error and rethrow it if the publish fails', async () => {
    const error = new Error('Failed to publish');
    mockMessagePublisher.publish.mockRejectedValue(error);

    await expect(useCase.execute(productMock)).rejects.toThrow(error);

    expect(mockMessagePublisher.publish).toHaveBeenCalledWith({
      id: '123-uuid',
      name: 'Updated Product',
      category: 'MAIN_COURSE',
      price: 200,
      description: 'An updated product',
      status: 'ACTIVE',
    });

    expect(mockLogger.log).toHaveBeenCalledWith(
      `An error ocurrend in send message to update order product ${error}`,
    );
  });
});
