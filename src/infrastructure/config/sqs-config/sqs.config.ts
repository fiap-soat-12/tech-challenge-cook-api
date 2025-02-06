import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
  SendMessageCommand,
} from '@aws-sdk/client-sqs';

export class SqsClient {
  private readonly client: SQSClient;

  constructor() {
    this.client = new SQSClient({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.AWS_ENDPOINT || 'http://localhost:4566',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async sendMessage<T>(queueUrl: string, message: T): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message),
    });

    try {
      await this.client.send(command);
      console.log(`Message sent to queue: ${queueUrl}`);
    } catch (error) {
      console.error(`Failed to send message to queue: ${error.message}`);
      throw error;
    }
  }

  async receiveMessages<T>(
    queueUrl: string,
  ): Promise<{ message: T; receiptHandles: string }[]> {
    const command = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
    });

    try {
      const response = await this.client.send(command);
      console.log(`Messages received from queue: ${queueUrl}`);

      const messages = response.Messages || [];

      return messages.map((msg) => {
        try {
          return {
            message: JSON.parse(msg.Body as string) as T,
            receiptHandles: msg.ReceiptHandle as string,
          };
        } catch (error) {
          const fixedMessage = msg.Body.replace(/(\w+):/g, '"$1":');
          return {
            message: JSON.parse(fixedMessage as string) as T,
            receiptHandles: msg.ReceiptHandle as string,
          };
        }
      });
    } catch (error) {
      console.error(`Failed to receive messages from queue: ${error.message}`);
      throw error;
    }
  }

  async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
    const command = new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    });

    try {
      await this.client.send(command);
      console.log(`Message deleted from queue: ${queueUrl}`);
    } catch (error) {
      console.error(`Failed to delete message from queue: ${error.message}`);
      throw error;
    }
  }
}
