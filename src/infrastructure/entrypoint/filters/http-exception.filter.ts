import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal Server Error';

    // Verifica se é uma exceção do NestJS
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    }

    // Tratamento para erros inesperados ou genéricos
    console.error('Unhandled exception:', exception);

    response.status(status).json({
      statusCode: status,
      message:
        typeof message === 'string' ? message : message['message'] || message,
      timestamp: new Date().toLocaleString(),
      path: request.url,
    });
  }
}
