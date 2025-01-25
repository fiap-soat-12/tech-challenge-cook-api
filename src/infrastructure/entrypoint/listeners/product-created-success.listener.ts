import { Logger } from '@application/interfaces/logger.interface';
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';

export class ProductCreatedSuccessListener {
  private readonly queueUrl: string;

  constructor(
    private readonly sqsClient: SQSClient,
    private readonly logger: Logger,
  ) {
    this.queueUrl = process.env.ORDER_PRODUCT_CREATE_ACCEPT_QUEUE || '';
    if (!this.queueUrl) {
      throw new Error('Queue URL for Product Created Success not configured');
    }
  }

  async listen(): Promise<void> {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 10,
      });

      const response = await this.sqsClient.send(command);

      if (response.Messages) {
        for (const message of response.Messages) {
          this.logger.log(`Message received: ${message.Body}`);

          // Aqui você processa a mensagem
          const product = JSON.parse(message.Body!);
          this.logger.log(`Processing product: ${JSON.stringify(product)}`);

          // Delete a mensagem após processar
          await this.deleteMessage(message.ReceiptHandle!);
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
      this.logger.log(`Message deleted from queue`);
    } catch (error) {
      this.logger.error(`Failed to delete message: ${error.message}`);
    }
  }
}
