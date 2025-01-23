import { Logger } from '@application/interfaces/logger.interface';
import { CreateProductUseCase } from '@application/usecases/products/create-product/create-product.usecase';
import { DeleteProductUseCase } from '@application/usecases/products/delete-product/delete-product.usecase';
import { GetProductByIdUseCase } from '@application/usecases/products/get-product-by-id/get-product-by-id.usecase';
import { GetProductPaginatedUseCase } from '@application/usecases/products/get-product-paginated/get-product-paginated.usecase';
import { GetProductUseCase } from '@application/usecases/products/get-product/get-product.usecase';
import { UpdateProductUseCase } from '@application/usecases/products/update-product/update-product.usecase';
import { DatabaseConnection } from '@domain/repositories/database-connection';
import { ProductRepository } from '@domain/repositories/product.repository';
import { CreateProductController } from '@infrastructure/entrypoint/controllers/create-product/create-product.controller';
import { DeleteProductController } from '@infrastructure/entrypoint/controllers/delete-product/delete-product.controller';
import { GetProductByIdController } from '@infrastructure/entrypoint/controllers/get-product-by-id/get-product-by-id.controller';
import { GetProductPaginatedController } from '@infrastructure/entrypoint/controllers/get-product-paginated/get-product-paginated.controller';
import { GetProductController } from '@infrastructure/entrypoint/controllers/get-product/get-product.controller';
import { UpdateProductController } from '@infrastructure/entrypoint/controllers/update-product/update-product.controller';
import { ProductPersistence } from '@infrastructure/repositories/product.persistence';
import { Module } from '@nestjs/common';
import { createWithLogger } from '../config/create-with-logger';
import { DatabaseModule } from './database.module';
import { LoggerModule } from './logger.module';

@Module({
  controllers: [
    CreateProductController,
    GetProductController,
    GetProductPaginatedController,
    GetProductByIdController,
    DeleteProductController,
    UpdateProductController,
  ],
  providers: [
    {
      provide: 'ProductRepository',
      useFactory: (dbConnection: DatabaseConnection, logger: Logger) =>
        new ProductPersistence(dbConnection, logger),
      inject: ['DatabaseConnection', 'Logger'],
    },

    // Casos de Uso
    {
      provide: CreateProductUseCase,
      useFactory: (repo: ProductRepository, logger: Logger) =>
        createWithLogger(CreateProductUseCase, [repo], logger),
      inject: ['ProductRepository', 'Logger'],
    },
    {
      provide: UpdateProductUseCase,
      useFactory: (repo: ProductRepository, logger: Logger) =>
        createWithLogger(UpdateProductUseCase, [repo], logger),
      inject: ['ProductRepository', 'Logger'],
    },
    {
      provide: DeleteProductUseCase,
      useFactory: (repo: ProductRepository, logger: Logger) =>
        createWithLogger(DeleteProductUseCase, [repo], logger),
      inject: ['ProductRepository', 'Logger'],
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
  imports: [DatabaseModule, LoggerModule],
})
export class ProductModule {}
