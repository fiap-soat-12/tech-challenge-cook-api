import { Logger } from '@application/interfaces/logger.interface';
import { SqsClient } from '@infrastructure/config/sqs-config/sqs.config';

export abstract class SqsListener<T> {
  protected readonly queueUrl: string;

  constructor(
    protected readonly sqsClient: SqsClient,
    protected readonly logger: Logger,
    private readonly queueName: string,
  ) {
    const awsUrl = process.env.AWS_URL || '';
    this.queueUrl = `${awsUrl}/${this.queueName}`;
  }

  async listen(): Promise<void> {
    if (!this.queueUrl) {
      throw new Error('Queue URL not configured');
    }

    while (true) {
      try {
        const messages = await this.sqsClient.receiveMessages<T>(this.queueUrl);

        if (messages.length > 0) {
          for (const msg of messages) {
            await this.handleMessage(msg.message);

            await this.sqsClient.deleteMessage(
              this.queueUrl,
              msg.receiptHandles,
            );
          }
        }
      } catch (error) {
        this.logger.error(`Error processing messages: ${error.message}`);
      }
    }
  }

  protected abstract handleMessage(message: T): Promise<void>;
}
