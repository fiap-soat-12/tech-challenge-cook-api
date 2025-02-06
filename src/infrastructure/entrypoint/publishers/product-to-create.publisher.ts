import { SendProductDto } from '@application/dto/send-product.dto';
import { Logger } from '@application/interfaces/logger.interface';
import { MessagePublisher } from '@application/interfaces/message-publisher.interface';
import { SqsClient } from '@infrastructure/config/sqs-config/sqs.config';

export class ProductToCreatePublisher
  implements MessagePublisher<SendProductDto>
{
  private readonly queueUrl: string;
  private readonly awsUrl: string;

  constructor(
    private readonly sqsClient: SqsClient,
    private readonly logger: Logger,
  ) {
    this.queueUrl = process.env.ORDER_PRODUCT_CREATE_QUEUE || '';
    this.awsUrl = process.env.AWS_URL || '';

    if (!this.queueUrl) {
      throw new Error(
        'ORDER_PRODUCT_CREATE_QUEUE environment variable is not set',
      );
    }

    if (!this.awsUrl) {
      throw new Error('AWS_URL environment variable is not set');
    }
  }

  async publish(product: SendProductDto): Promise<void> {
    try {
      await this.sqsClient.sendMessage(
        `${this.awsUrl}/${this.queueUrl}`,
        product,
      );
      this.logger.log(
        `Product created event published: ${JSON.stringify(product)}`,
      );
    } catch (error) {
      this.logger.error(
        `Error publishing product created event: ${error.message}`,
      );
      throw new Error(
        `Error publishing product created event: ${error.message}`,
      );
    }
  }
}
