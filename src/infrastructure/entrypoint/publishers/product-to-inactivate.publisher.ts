import { SendProductDto } from '@application/dto/send-product.dto';
import { Logger } from '@application/interfaces/logger.interface';
import { MessagePublisher } from '@application/interfaces/message-publisher.interface';
import { SqsClient } from '@infrastructure/config/sqs-config/sqs.config';

export class ProductToInactivatePublisher
  implements MessagePublisher<SendProductDto>
{
  private readonly queueUrl: string;

  constructor(
    private readonly sqsClient: SqsClient,
    private readonly logger: Logger,
  ) {
    this.queueUrl = process.env.ORDER_PRODUCT_DELETE_QUEUE || '';
  }

  async publish(product: SendProductDto): Promise<void> {
    if (!this.queueUrl) {
      throw new Error('Queue URL for Product Deleted not configured');
    }

    try {
      await this.sqsClient.sendMessage(this.queueUrl, product);
      this.logger.log(
        `Product deleted event published: ${JSON.stringify(product)}`,
      );
    } catch (error) {
      this.logger.error(`Error receiving messages: ${error.message}`);
    }
  }
}
