import { SendProductDto } from '@application/dto/send-product.dto';
import { Logger } from '@application/interfaces/logger.interface';
import { SqsClient } from '@infrastructure/config/sqs-config/sqs.config';
import { ProductToUpdatePublisher } from './product-to-update.publisher';

describe('ProductToUpdatePublisher', () => {
  let publisher: ProductToUpdatePublisher;
  let sqsClient: SqsClient;
  let logger: Logger;
  const queueUrl = 'test-queue-url';

  beforeEach(() => {
    sqsClient = {
      sendMessage: jest.fn(),
    } as unknown as SqsClient;

    logger = {
      log: jest.fn(),
      error: jest.fn(),
    } as unknown as Logger;

    process.env.ORDER_PRODUCT_UPDATE_QUEUE = queueUrl;
    publisher = new ProductToUpdatePublisher(sqsClient, logger);
  });

  afterEach(() => {
    delete process.env.ORDER_PRODUCT_UPDATE_QUEUE;
  });

  it('should publish product updated event successfully', async () => {
    const product: SendProductDto = {
      id: '123',
      name: 'Test Product',
      category: 'MAIN_COURSE',
      price: 0,
      description: '',
      status: 'ACTIVE',
    };

    await publisher.publish(product);

    expect(sqsClient.sendMessage).toHaveBeenCalledWith(queueUrl, product);
    expect(logger.log).toHaveBeenCalledWith(
      `Product updated event published: ${JSON.stringify(product)}`,
    );
  });

  it('should log an error if publishing fails', async () => {
    const product: SendProductDto = {
      id: '123',
      name: 'Test Product',
      category: 'MAIN_COURSE',
      price: 0,
      description: '',
      status: 'ACTIVE',
    };
    const errorMessage = 'Failed to send message';
    (sqsClient.sendMessage as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    await publisher.publish(product);

    expect(logger.error).toHaveBeenCalledWith(
      `Error receiving messages: ${errorMessage}`,
    );
  });
});
