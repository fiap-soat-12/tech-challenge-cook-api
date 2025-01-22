import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

export function setupValidationPipe(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 422,
      exceptionFactory: (errors) => {
        return new BadRequestException(
          errors.map((error) => ({
            field: error.property,
            errors: Object.values(error.constraints || {}),
          })),
        );
      },
    }),
  );
}
