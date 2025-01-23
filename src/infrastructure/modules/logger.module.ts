import { NestLoggerAdapter } from '@infrastructure/log/nest-logger.adapter';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: 'Logger',
      useClass: NestLoggerAdapter,
    },
  ],
  exports: ['Logger'],
})
export class LoggerModule {}
