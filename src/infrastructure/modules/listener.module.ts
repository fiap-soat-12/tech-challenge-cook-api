import { Logger } from '@application/interfaces/logger.interface';
import { CreateOrderProductUseCase } from '@application/usecases/order/create-order/create-order.usecase';
import { createWithLogger } from '@infrastructure/config/create-with-logger/create-with-logger';
import { SqsClient } from '@infrastructure/config/sqs-config/sqs.config';
import { CreateOrderProductListener } from '@infrastructure/entrypoint/listeners/create-order-product.listener';
import { Module } from '@nestjs/common';
import { LoggerModule } from './logger.module';
import { OrderModule } from './order.module';

@Module({
  imports: [LoggerModule, OrderModule],
  providers: [
    {
      provide: 'SqsClient',
      useClass: SqsClient,
    },
    {
      provide: CreateOrderProductListener,
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
      inject: ['SqsClient', 'Logger', CreateOrderProductUseCase],
    },
  ],
  exports: [CreateOrderProductListener],
})
export class ListenerModule {}
