import { SendProductDto } from '@application/dto/send-product.dto';
import { ProductCategoryEnum } from '@application/enums/product-category.enum';
import { ProductStatusEnum } from '@application/enums/product-status.enum';
import { Logger } from '@application/interfaces/logger.interface';
import { MessagePublisher } from '@application/interfaces/message-publisher.interface';
import { Product } from '@domain/entities/product';
import { CreateProductInOrderUseCase } from './create-product-in-order.usecase';

describe('CreateProductInOrderUseCase', () => {
  let useCase: CreateProductInOrderUseCase;
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

    useCase = new CreateProductInOrderUseCase(mockMessagePublisher, mockLogger);

    productMock = new Product({
      id: '123',
      name: 'Test Product',
      category: ProductCategoryEnum.MAIN_COURSE,
      price: 100,
      description: 'A test product',
      status: ProductStatusEnum.ACTIVE,
    });
  });

  it('should publish a message with the correct data', async () => {
    await useCase.execute(productMock);

    expect(mockMessagePublisher.publish).toHaveBeenCalledWith({
      id: '123',
      name: 'Test Product',
      category: ProductCategoryEnum.MAIN_COURSE,
      price: 100,
      description: 'A test product',
      status: ProductStatusEnum.ACTIVE,
    });

    expect(mockMessagePublisher.publish).toHaveBeenCalledTimes(1);
    expect(mockLogger.log).not.toHaveBeenCalled();
  });

  it('should log an error and rethrow it if the publish fails', async () => {
    const error = new Error('Failed to publish');
    mockMessagePublisher.publish.mockRejectedValue(error);

    await expect(useCase.execute(productMock)).rejects.toThrow(error);

    expect(mockMessagePublisher.publish).toHaveBeenCalledWith({
      id: '123',
      name: 'Test Product',
      category: ProductCategoryEnum.MAIN_COURSE,
      price: 100,
      description: 'A test product',
      status: ProductStatusEnum.ACTIVE,
    });

    expect(mockLogger.log).toHaveBeenCalledWith(
      `An error ocurrend in send message to create order product ${error}`,
    );
  });
});
