import { Logger } from '@application/interfaces/logger.interface';
import { CreateOrderProductUseCase } from '@application/usecases/order/create-order/create-order.usecase';
import { createWithLogger } from '@infrastructure/config/create-with-logger/create-with-logger';
import { SqsClient } from '@infrastructure/config/sqs-config/sqs.config';
import { CreateOrderProductListener } from '@infrastructure/entrypoint/listeners/create-order-product.listener';
import { ProductToCreatePublisher } from '@infrastructure/entrypoint/publishers/product-to-create.publisher';
import { ProductToInactivatePublisher } from '@infrastructure/entrypoint/publishers/product-to-inactivate.publisher';
import { ProductToUpdatePublisher } from '@infrastructure/entrypoint/publishers/product-to-update.publisher';
import { Module } from '@nestjs/common';
import { LoggerModule } from './logger.module';

@Module({
  providers: [
    {
      provide: 'SqsClient',
      useClass: SqsClient,
    },
    {
      provide: 'CreateOrderProductUseCase',
      useClass: CreateOrderProductUseCase,
    },
    {
      provide: 'ProductToCreatePublisher',
      useFactory: (sqsClient: SqsClient, logger: Logger) =>
        createWithLogger(ProductToCreatePublisher, [sqsClient], logger),
      inject: ['SqsClient', 'Logger'],
    },
    {
      provide: 'ProductToUpdatePublisher',
      useFactory: (sqsClient: SqsClient, logger: Logger) =>
        createWithLogger(ProductToUpdatePublisher, [sqsClient], logger),
      inject: ['SqsClient', 'Logger'],
    },
    {
      provide: 'ProductToInactivatePublisher',
      useFactory: (sqsClient: SqsClient, logger: Logger) =>
        createWithLogger(ProductToInactivatePublisher, [sqsClient], logger),
      inject: ['SqsClient', 'Logger'],
    },
    {
      provide: 'CreateOrderProductListener',
      useFactory: (
        sqsClient: SqsClient,
        logger: Logger,
        createOrderUseCase: CreateOrderProductUseCase,
      ) =>
        createWithLogger(
          CreateOrderProductListener,
          [sqsClient, createOrderUseCase],
          logger,
        ),
      inject: ['SqsClient', 'Logger', 'CreateOrderProductUseCase'],
    },
  ],
  exports: [
    'ProductToCreatePublisher',
    'ProductToInactivatePublisher',
    'ProductToUpdatePublisher',
  ],
  imports: [LoggerModule],
})
export class MessagingModule {}
