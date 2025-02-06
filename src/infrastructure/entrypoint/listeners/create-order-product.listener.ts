import { CreateOrderDto } from '@application/dto/create-order.dto';
import { Logger } from '@application/interfaces/logger.interface';
import { CreateOrderProductUseCase } from '@application/usecases/order/create-order/create-order.usecase';
import { SqsClient } from '@infrastructure/config/sqs-config/sqs.config';
import { SqsListener } from '@infrastructure/config/sqs-config/sqs.listener';
import { OnModuleInit } from '@nestjs/common';

export class CreateOrderProductListener
  extends SqsListener<CreateOrderDto>
  implements OnModuleInit
{
  protected readonly queueUrl: string;

  constructor(
    readonly sqsClient: SqsClient,
    readonly logger: Logger,
    readonly createOrderUseCase: CreateOrderProductUseCase,
  ) {
    super(sqsClient, logger, process.env.COOK_ORDER_CREATE_QUEUE || '');
  }

  onModuleInit() {
    this.listen();
  }

  protected async handleMessage(message: CreateOrderDto): Promise<void> {
    this.logger.log(`Received message: ${JSON.stringify(message)}`);
    await this.createOrderUseCase.execute(message);
  }
}
