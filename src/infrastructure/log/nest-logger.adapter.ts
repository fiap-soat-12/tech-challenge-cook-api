import { Logger } from '@application/interfaces/logger.interface';
import { Injectable, Logger as NestLogger } from '@nestjs/common';

@Injectable()
export class NestLoggerAdapter implements Logger {
  private context = '';
  private readonly logger = new NestLogger();

  setContext(context: string): void {
    this.context = context;
  }

  log(message: string, context?: string): void {
    this.logger.log(message, context || this.context);
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, trace, context || this.context);
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, context || this.context);
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, context || this.context);
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, context || this.context);
  }
}
