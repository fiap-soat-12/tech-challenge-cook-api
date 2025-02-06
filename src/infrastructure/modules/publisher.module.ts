import { Logger } from '@application/interfaces/logger.interface';
import { createWithLogger } from '@infrastructure/config/create-with-logger/create-with-logger';
import { SqsClient } from '@infrastructure/config/sqs-config/sqs.config';
import { EvolveOrderPublisher } from '@infrastructure/entrypoint/publishers/evolve-order.publisher';
import { ProductToCreatePublisher } from '@infrastructure/entrypoint/publishers/product-to-create.publisher';
import { ProductToInactivatePublisher } from '@infrastructure/entrypoint/publishers/product-to-inactivate.publisher';
import { ProductToUpdatePublisher } from '@infrastructure/entrypoint/publishers/product-to-update.publisher';
import { Module } from '@nestjs/common';
import { LoggerModule } from './logger.module';

@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: 'SqsClient',
      useClass: SqsClient,
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
      provide: 'EvolveOrderPublisher',
      useFactory: (sqsClient: SqsClient, logger: Logger) =>
        createWithLogger(EvolveOrderPublisher, [sqsClient], logger),
      inject: ['SqsClient', 'Logger'],
    },
  ],
  exports: [
    'ProductToCreatePublisher',
    'ProductToInactivatePublisher',
    'ProductToUpdatePublisher',
    'EvolveOrderPublisher',
  ],
})
export class PublisherModule {}
