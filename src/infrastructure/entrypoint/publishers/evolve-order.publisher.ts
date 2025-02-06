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
  private readonly awsUrl: string;

  constructor(
    private readonly sqsClient: SqsClient,
    private readonly logger: Logger,
  ) {
    this.queueUrl = process.env.ORDER_STATUS_UPDATE_QUEUE || '';
    this.awsUrl = process.env.AWS_URL || '';

    if (!this.queueUrl) {
      throw new Error(
        'ORDER_STATUS_UPDATE_QUEUE environment variable is not set',
      );
    }

    if (!this.awsUrl) {
      throw new Error('AWS_URL environment variable is not set');
    }
  }

  async publish(input: { orderId: UUID }): Promise<void> {
    try {
      await this.sqsClient.sendMessage(
        `${this.awsUrl}/${this.queueUrl}`,
        input,
      );
      this.logger.log(`Order evolve event published: ${JSON.stringify(input)}`);
    } catch (error) {
      this.logger.error(
        `Error publishing order evolve event: ${error.message}`,
      );
      throw new Error(`Error publishing order evolve event: ${error.message}`);
    }
  }
}
