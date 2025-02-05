import { CreateOrderDto } from '@application/dto/create-order.dto';
import { Logger } from '@application/interfaces/logger.interface';
import { MessageListener } from '@application/interfaces/message-listener.interface';
import { CreateOrderProductUseCase } from '@application/usecases/order/create-order/create-order.usecase';
import { SqsClient } from '@infrastructure/config/sqs-config/sqs.config';

export class CreateOrderProductListener implements MessageListener {
  private readonly queueUrl: string;
  private readonly awsUrl: string;

  constructor(
    private readonly sqsClient: SqsClient,
    private readonly logger: Logger,
    private readonly createOrderUseCase: CreateOrderProductUseCase,
  ) {
    this.queueUrl = process.env.COOK_ORDER_CREATE_QUEUE || '';
    this.awsUrl = process.env.AWS_URL || '';
  }

  async listen(): Promise<void> {
    if (!this.queueUrl || !this.awsUrl) {
      throw new Error('Queue URL for Order Created not configured');
    }

    try {
      const message = await this.sqsClient.receiveMessages<CreateOrderDto>(
        `${this.awsUrl}/${this.queueUrl}`,
      );

      if (message) {
        const order: CreateOrderDto = message;
        this.logger.log(
          `Order created event received: ${JSON.stringify(order)}`,
        );
        await this.createOrderUseCase.execute(order);
      }
    } catch (error) {
      this.logger.error(`Error receiving messages: ${error.message}`);
    }
  }
}
