import { Logger } from '@application/interfaces/logger.interface';
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';

export class ProductCreatedSuccessListener {
  private readonly queueUrl: string;
  private readonly awsUrl: string;

  constructor(
    private readonly sqsClient: SQSClient,
    private readonly logger: Logger,
  ) {
    this.queueUrl = process.env.ORDER_PRODUCT_CREATE_ACCEPT_QUEUE || '';
    this.awsUrl = process.env.AWS_URL || '';
  }

  async listen(): Promise<void> {
    if (!this.queueUrl || !this.awsUrl) {
      throw new Error('Queue URL for Product Created Success not configured');
    }

    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: `${this.awsUrl}/${this.queueUrl}`,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 10,
      });

      const response = await this.sqsClient.send(command);

      if (response.Messages) {
        for (const message of response.Messages) {
          this.logger.log(`Message received: ${message.Body}`);

          const product = JSON.parse(message.Body);
          this.logger.log(`Processing product: ${JSON.stringify(product)}`);

          await this.deleteMessage(message.ReceiptHandle);
        }
      }
    } catch (error) {
      this.logger.error(`Error receiving messages: ${error.message}`);
    }
  }

  private async deleteMessage(receiptHandle: string): Promise<void> {
    const command = new DeleteMessageCommand({
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle,
    });

    try {
      await this.sqsClient.send(command);
      this.logger.log(`Message sended from queue`);
    } catch (error) {
      this.logger.error(`Failed to inactivate message: ${error.message}`);
    }
  }
}
