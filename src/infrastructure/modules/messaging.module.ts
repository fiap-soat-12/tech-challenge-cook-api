import { Logger } from '@application/interfaces/logger.interface';
import { createWithLogger } from '@infrastructure/config/create-with-logger/create-with-logger';
import { SqsClient } from '@infrastructure/config/sqs-config/sqs.config';
import { ProductCreatedSuccessListener } from '@infrastructure/entrypoint/listeners/product-created-success.listener';
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
      provide: 'ProductCreatedSuccessListener',
      useFactory: (sqsClient: SqsClient, logger: Logger) =>
        createWithLogger(ProductCreatedSuccessListener, [sqsClient], logger),
      inject: ['SqsClient', 'Logger'],
    },
  ],
  exports: [
    'ProductToCreatePublisher',
    'ProductToInactivatePublisher',
    'ProductToUpdatePublisher',
    'ProductCreatedSuccessListener',
  ],
  imports: [LoggerModule],
})
export class MessagingModule {}
