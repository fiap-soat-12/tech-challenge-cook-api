import { NotFoundDomainExceptionFilter } from '@infrastructure/entrypoint/filters/not-found.filter';
import { NestLoggerAdapter } from '@infrastructure/log/nest-logger.adapter';
import { DatabaseModule } from '@infrastructure/modules/database.module';
import { ProductModule } from '@infrastructure/modules/product.module';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
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
  imports: [ProductModule, DatabaseModule],
  exports: ['Logger'],
})
export class AppModule {}
