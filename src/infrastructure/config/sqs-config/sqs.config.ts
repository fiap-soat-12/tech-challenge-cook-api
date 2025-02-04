import {
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

  async receiveMessages<T>(queueUrl: string): Promise<T | null> {
    const command = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 20,
    });

    try {
      const response = await this.client.send(command);
      console.log(`Messages received from queue: ${queueUrl}`);
      const messages = response.Messages || [];
      return messages.length > 0
        ? (JSON.parse(messages[0].Body as string) as T)
        : null;
    } catch (error) {
      console.error(`Failed to receive messages from queue: ${error.message}`);
      throw error;
    }
  }
}
