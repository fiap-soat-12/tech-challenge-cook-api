import { SendProductDto } from '@application/dto/send-product.dto';
import { Logger } from '@application/interfaces/logger.interface';
import { MessagePublisher } from '@application/interfaces/message-publisher.interface';
import { SqsClient } from '@infrastructure/config/sqs-config/sqs.config';

export class ProductToUpdatePublisher
  implements MessagePublisher<SendProductDto>
{
  private readonly queueUrl: string;

  constructor(
    private readonly sqsClient: SqsClient,
    private readonly logger: Logger,
  ) {
    this.queueUrl = process.env.ORDER_PRODUCT_UPDATE_QUEUE || '';
  }

  async publish(product: SendProductDto): Promise<void> {
    if (!this.queueUrl) {
      throw new Error('Queue URL for Product Updated not configured');
    }

    try {
      await this.sqsClient.sendMessage(this.queueUrl, product);
      this.logger.log(
        `Product updated event published: ${JSON.stringify(product)}`,
      );
    } catch (error) {
      this.logger.error(`Error receiving messages: ${error.message}`);
    }
  }
}
