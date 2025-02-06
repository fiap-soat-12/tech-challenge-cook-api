import { Logger } from '@application/interfaces/logger.interface';
import { CreateOrderProductUseCase } from '@application/usecases/order/create-order/create-order.usecase';
import { GetOrderByIdUseCase } from '@application/usecases/order/get-order-by-id/get-order-by-id.usecase';
import { EvolveOrderUseCase } from '@application/usecases/order/send/evolve-order/evolve-order.usecase';
import { UpdateOrderStatusUseCase } from '@application/usecases/order/update-order-status/update-order-status.usecase';
import { GetProductByIdUseCase } from '@application/usecases/products/get-product-by-id/get-product-by-id.usecase';
import { DatabaseConnection } from '@domain/interface/database-connection.interface';
import { OrderRepository } from '@domain/repositories/order.repository';
import { UpdateOrderStatusController } from '@infrastructure/entrypoint/controllers/update-order-status/update-order-status.controller';
import { EvolveOrderPublisher } from '@infrastructure/entrypoint/publishers/evolve-order.publisher';
import { OrderPersistence } from '@infrastructure/repositories/order.persistence';
import { Module } from '@nestjs/common';
import { createWithLogger } from '../config/create-with-logger/create-with-logger';
import { DatabaseModule } from './database.module';
import { LoggerModule } from './logger.module';
import { ProductModule } from './product.module';
import { PublisherModule } from './publisher.module';

@Module({
  controllers: [UpdateOrderStatusController],
  imports: [DatabaseModule, LoggerModule, ProductModule, PublisherModule],
  providers: [
    {
      provide: 'OrderRepository',
      useFactory: (dbConnection: DatabaseConnection, logger: Logger) =>
        new OrderPersistence(dbConnection, logger),
      inject: ['DatabaseConnection', 'Logger'],
    },
    {
      provide: CreateOrderProductUseCase,
      useFactory: (
        repo: OrderRepository,
        getProductByIdUseCase: GetProductByIdUseCase,
        getOrderByIdUseCase: GetOrderByIdUseCase,
        logger: Logger,
      ) =>
        createWithLogger(
          CreateOrderProductUseCase,
          [repo, getProductByIdUseCase, getOrderByIdUseCase],
          logger,
        ),
      inject: [
        'OrderRepository',
        GetProductByIdUseCase,
        GetOrderByIdUseCase,
        'Logger',
      ],
    },

    {
      provide: EvolveOrderUseCase,
      useFactory: (sqs: EvolveOrderPublisher, logger: Logger) =>
        createWithLogger(EvolveOrderUseCase, [sqs], logger),
      inject: ['EvolveOrderPublisher', 'Logger'],
    },
    {
      provide: UpdateOrderStatusUseCase,
      useFactory: (
        repo: OrderRepository,
        queue: EvolveOrderUseCase,
        logger: Logger,
      ) => createWithLogger(UpdateOrderStatusUseCase, [repo, queue], logger),
      inject: ['OrderRepository', EvolveOrderUseCase, 'Logger'],
    },
    {
      provide: GetOrderByIdUseCase,
      useFactory: (repo: OrderRepository, logger: Logger) =>
        createWithLogger(GetOrderByIdUseCase, [repo], logger),
      inject: ['OrderRepository', 'Logger'],
    },
  ],
  exports: [CreateOrderProductUseCase, GetOrderByIdUseCase],
})
export class OrderModule {}
