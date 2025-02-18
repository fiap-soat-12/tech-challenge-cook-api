import { EvolveOrderPublisher } from '@infrastructure/entrypoint/publishers/evolve-order.publisher';
import { SqsClient } from '@infrastructure/config/sqs-config/sqs.config';
import { Logger } from '@application/interfaces/logger.interface';
import { UUID } from '@application/types/UUID.type';

describe('EvolveOrderPublisher', () => {
  let sqsClient: SqsClient;
  let logger: Logger;
  let evolveOrderPublisher: EvolveOrderPublisher;

  beforeEach(() => {
    sqsClient = {
      sendMessage: jest.fn(),
    } as unknown as SqsClient;

    logger = {
      log: jest.fn(),
      error: jest.fn(),
    } as unknown as Logger;

    process.env.ORDER_STATUS_UPDATE_QUEUE = 'test-queue-url';
    evolveOrderPublisher = new EvolveOrderPublisher(sqsClient, logger);
  });

  it('should publish a message successfully', async () => {
    const input = { orderId: '1234' as UUID };

    await evolveOrderPublisher.publish(input);

    expect(sqsClient.sendMessage).toHaveBeenCalledWith('test-queue-url', input);
    expect(logger.log).toHaveBeenCalledWith(
      `Order evolve event published: ${JSON.stringify(input)}`,
    );
  });

  it('should log an error and throw an exception if publishing fails', async () => {
    const input = { orderId: '1234' as UUID };
    const errorMessage = 'Failed to send message';
    (sqsClient.sendMessage as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    await expect(evolveOrderPublisher.publish(input)).rejects.toThrow(
      `Error publishing order evolve event: ${errorMessage}`,
    );
    expect(logger.error).toHaveBeenCalledWith(
      `Error publishing order evolve event: ${errorMessage}`,
    );
  });

  it('should throw an error if ORDER_STATUS_UPDATE_QUEUE is not set', () => {
    delete process.env.ORDER_STATUS_UPDATE_QUEUE;

    expect(() => new EvolveOrderPublisher(sqsClient, logger)).toThrow(
      'ORDER_STATUS_UPDATE_QUEUE environment variable is not set',
    );
  });
});
