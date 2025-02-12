import { Logger } from '@application/interfaces/logger.interface';
import { MessagePublisher } from '@application/interfaces/message-publisher.interface';
import { UUID } from '@application/types/UUID.type';
import { SqsClient } from '@infrastructure/config/sqs-config/sqs.config';

export class EvolveOrderPublisher
  implements
    MessagePublisher<{
      orderId: UUID;
    }>
{
  private readonly queueUrl: string;

  constructor(
    private readonly sqsClient: SqsClient,
    private readonly logger: Logger,
  ) {
    this.queueUrl = process.env.ORDER_STATUS_UPDATE_QUEUE || '';

    if (!this.queueUrl) {
      throw new Error(
        'ORDER_STATUS_UPDATE_QUEUE environment variable is not set',
      );
    }
  }

  async publish(input: { orderId: UUID }): Promise<void> {
    try {
      await this.sqsClient.sendMessage(this.queueUrl, input);
      this.logger.log(`Order evolve event published: ${JSON.stringify(input)}`);
    } catch (error) {
      this.logger.error(
        `Error publishing order evolve event: ${error.message}`,
      );
      throw new Error(`Error publishing order evolve event: ${error.message}`);
    }
  }
}
