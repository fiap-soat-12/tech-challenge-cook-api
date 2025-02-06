import { Logger } from '@application/interfaces/logger.interface';
import { SqsClient } from '@infrastructure/config/sqs-config/sqs.config';

export abstract class SqsListener<T> {
  protected readonly queueUrl: string;
  protected readonly sqsClient: SqsClient;
  protected readonly logger: Logger;

  constructor(sqsClient: SqsClient, logger: Logger, queueUrl: string) {
    const awsUrl = process.env.AWS_URL || '';

    this.sqsClient = sqsClient;
    this.logger = logger;
    this.queueUrl = `${awsUrl}/${queueUrl}`;
  }

  async listen(): Promise<void> {
    if (!this.queueUrl) {
      throw new Error('Queue URL not configured');
    }

    while (true) {
      const messages = await this.sqsClient.receiveMessages<T>(this.queueUrl);

      if (messages.length > 0) {
        for (const msg of messages) {
          try {
            await this.handleMessage(msg.message);
          } catch (error) {
            this.logger.error(
              `Error processing message: ${error.message}`,
              error.stack,
            );
          }

          await this.sqsClient.deleteMessage(this.queueUrl, msg.receiptHandles);
        }
      }
    }
  }

  protected abstract handleMessage(message: T): Promise<void>;
}
