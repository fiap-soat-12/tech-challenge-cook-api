import { NotFoundDomainException } from '@domain/exceptions/not-found.exception';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch(NotFoundDomainException)
export class NotFoundDomainExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundDomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
