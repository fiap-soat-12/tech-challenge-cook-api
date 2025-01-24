import { SendProductDto } from '@application/dto/send-product.dto';
import { Logger } from '@application/interfaces/logger.interface';
import { MessagePublisher } from '@application/interfaces/message-publisher.interface';
import { SqsClient } from '@infrastructure/config/sqs.config';

export class ProductToCreatePublisher
  implements MessagePublisher<SendProductDto>
{
  private readonly queueUrl: string;

  constructor(
    private readonly sqsClient: SqsClient,
    private readonly logger: Logger,
  ) {
    this.queueUrl = process.env.ORDER_PRODUCT_CREATE_QUEUE || '';
    if (!this.queueUrl) {
      throw new Error('Queue URL for Product Created not configured');
    }
  }

  async publish(product: SendProductDto): Promise<void> {
    await this.sqsClient.sendMessage(this.queueUrl, product);
    this.logger.log(
      `Product created event published: ${JSON.stringify(product)}`,
    );
  }
}
