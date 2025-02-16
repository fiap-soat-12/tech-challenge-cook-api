import { HealthCheckController } from '@infrastructure/entrypoint/controllers/health-check/heatlh-check.controller';
import { NotFoundDomainExceptionFilter } from '@infrastructure/entrypoint/filters/not-found.filter';
import { NestLoggerAdapter } from '@infrastructure/log/nest-logger.adapter';
import { DatabaseModule } from '@infrastructure/modules/database.module';
import { ListenerModule } from '@infrastructure/modules/listener.module';
import { ProductModule } from '@infrastructure/modules/product.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { OrderModule } from './order.module';
import { PublisherModule } from './publisher.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  controllers: [HealthCheckController],
  providers: [
    {
      provide: 'Logger',
      useClass: NestLoggerAdapter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundDomainExceptionFilter,
    },
  ],
  imports: [
    PrometheusModule.register(),
    HttpModule,
    TerminusModule,
    ProductModule,
    DatabaseModule,
    ListenerModule,
    OrderModule,
    PublisherModule,
    ListenerModule,
  ],
  exports: ['Logger'],
})
export class AppModule {}
