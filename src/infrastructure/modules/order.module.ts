import { Logger } from '@application/interfaces/logger.interface';
import { CreateOrderProductUseCase } from '@application/usecases/order/create-order/create-order.usecase';
import { DatabaseConnection } from '@domain/interface/database-connection.interface';
import { OrderRepository } from '@domain/repositories/order.repository';
import { OrderPersistence } from '@infrastructure/repositories/order.persistence';
import { Module } from '@nestjs/common';
import { createWithLogger } from '../config/create-with-logger/create-with-logger';
import { DatabaseModule } from './database.module';
import { LoggerModule } from './logger.module';

@Module({
  imports: [DatabaseModule, LoggerModule],
  providers: [
    {
      provide: 'OrderRepository',
      useFactory: (dbConnection: DatabaseConnection, logger: Logger) =>
        new OrderPersistence(dbConnection, logger),
      inject: ['DatabaseConnection', 'Logger'],
    },
    {
      provide: CreateOrderProductUseCase,
      useFactory: (repo: OrderRepository, logger: Logger) =>
        createWithLogger(CreateOrderProductUseCase, [repo], logger),
      inject: ['OrderRepository', 'Logger'],
    },
  ],
})
export class OrderModule {}
