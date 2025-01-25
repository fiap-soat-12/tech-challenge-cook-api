import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

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

  async sendMessage(queueUrl: string, message: any): Promise<void> {
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
}
