import { Logger } from '@application/interfaces/logger.interface';
import { CreateProductInOrderUseCase } from '@application/usecases/order/send/create-product-in-order/create-product-in-order.usecase';
import { InactivateProductInOrderUseCase } from '@application/usecases/order/send/inactivate-product-in-order/inactivate-product-in-order.usecase';
import { UpdateProductInOrderUseCase } from '@application/usecases/order/send/update-product-in-order/update-product-in-order.usecase';
import { CreateProductUseCase } from '@application/usecases/products/create-product/create-product.usecase';
import { GetProductByIdUseCase } from '@application/usecases/products/get-product-by-id/get-product-by-id.usecase';
import { GetProductPaginatedUseCase } from '@application/usecases/products/get-product-paginated/get-product-paginated.usecase';
import { GetProductUseCase } from '@application/usecases/products/get-product/get-product.usecase';
import { InactivateProductUseCase } from '@application/usecases/products/inactivate-product/inactivate-product.usecase';
import { UpdateProductUseCase } from '@application/usecases/products/update-product/update-product.usecase';
import { DatabaseConnection } from '@domain/interface/database-connection.interface';
import { ProductRepository } from '@domain/repositories/product.repository';
import { CreateProductController } from '@infrastructure/entrypoint/controllers/create-product/create-product.controller';
import { GetProductByIdController } from '@infrastructure/entrypoint/controllers/get-product-by-id/get-product-by-id.controller';
import { GetProductPaginatedController } from '@infrastructure/entrypoint/controllers/get-product-paginated/get-product-paginated.controller';
import { GetProductController } from '@infrastructure/entrypoint/controllers/get-product/get-product.controller';
import { InactivateProductController } from '@infrastructure/entrypoint/controllers/inactivate-product/inactivate-product.controller';
import { UpdateProductController } from '@infrastructure/entrypoint/controllers/update-product/update-product.controller';
import { ProductToCreatePublisher } from '@infrastructure/entrypoint/publishers/product-to-create.publisher';
import { ProductToInactivatePublisher } from '@infrastructure/entrypoint/publishers/product-to-inactivate.publisher';
import { ProductToUpdatePublisher } from '@infrastructure/entrypoint/publishers/product-to-update.publisher';
import { ProductPersistence } from '@infrastructure/repositories/product.persistence';
import { Module } from '@nestjs/common';
import { createWithLogger } from '../config/create-with-logger/create-with-logger';
import { DatabaseModule } from './database.module';
import { LoggerModule } from './logger.module';
import { PublisherModule } from './publisher.module';
@Module({
  imports: [DatabaseModule, LoggerModule, PublisherModule],
  controllers: [
    CreateProductController,
    GetProductController,
    GetProductPaginatedController,
    GetProductByIdController,
    InactivateProductController,
    UpdateProductController,
  ],
  providers: [
    {
      provide: 'ProductRepository',
      useFactory: (dbConnection: DatabaseConnection, logger: Logger) =>
        new ProductPersistence(dbConnection, logger),
      inject: ['DatabaseConnection', 'Logger'],
    },
    // Message Usecases
    {
      provide: CreateProductInOrderUseCase,
      useFactory: (sqs: ProductToCreatePublisher, logger: Logger) =>
        createWithLogger(CreateProductInOrderUseCase, [sqs], logger),
      inject: ['ProductToCreatePublisher', 'Logger'],
    },
    {
      provide: UpdateProductInOrderUseCase,
      useFactory: (sqs: ProductToUpdatePublisher, logger: Logger) =>
        createWithLogger(UpdateProductInOrderUseCase, [sqs], logger),
      inject: ['ProductToUpdatePublisher', 'Logger'],
    },
    {
      provide: InactivateProductInOrderUseCase,
      useFactory: (sqs: ProductToInactivatePublisher, logger: Logger) =>
        createWithLogger(InactivateProductInOrderUseCase, [sqs], logger),
      inject: ['ProductToInactivatePublisher', 'Logger'],
    },
    // Usecases
    {
      provide: CreateProductUseCase,
      useFactory: (
        repo: ProductRepository,
        queue: CreateProductInOrderUseCase,
        logger: Logger,
      ) => createWithLogger(CreateProductUseCase, [repo, queue], logger),
      inject: ['ProductRepository', CreateProductInOrderUseCase, 'Logger'],
    },
    {
      provide: UpdateProductUseCase,
      useFactory: (
        repo: ProductRepository,
        queue: UpdateProductInOrderUseCase,
        logger: Logger,
      ) => createWithLogger(UpdateProductUseCase, [repo, queue], logger),
      inject: ['ProductRepository', UpdateProductInOrderUseCase, 'Logger'],
    },
    {
      provide: InactivateProductUseCase,
      useFactory: (
        repo: ProductRepository,
        queue: InactivateProductInOrderUseCase,
        logger: Logger,
      ) => createWithLogger(InactivateProductUseCase, [repo, queue], logger),
      inject: ['ProductRepository', InactivateProductInOrderUseCase, 'Logger'],
    },
    {
      provide: GetProductUseCase,
      useFactory: (repo: ProductRepository, logger: Logger) =>
        createWithLogger(GetProductUseCase, [repo, logger], logger),
      inject: ['ProductRepository', 'Logger'],
    },
    {
      provide: GetProductByIdUseCase,
      useFactory: (repo: ProductRepository, logger: Logger) =>
        createWithLogger(GetProductByIdUseCase, [repo], logger),
      inject: ['ProductRepository', 'Logger'],
    },
    {
      provide: GetProductPaginatedUseCase,
      useFactory: (repo: ProductRepository, logger: Logger) =>
        createWithLogger(GetProductPaginatedUseCase, [repo], logger),
      inject: ['ProductRepository', 'Logger'],
    },
  ],
  exports: [GetProductByIdUseCase],
})
export class ProductModule {}
