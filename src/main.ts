import { GLOBAL_PREFIX, SWAGGER_PATH } from '@infrastructure/config/constants';
import { setupSwagger } from '@infrastructure/config/swagger.config';
import { setupValidationPipe } from '@infrastructure/config/validation-pipe.config';
import { HttpExceptionFilter } from '@infrastructure/entrypoint/filters/http-exception.filter';
import { NotFoundDomainExceptionFilter } from '@infrastructure/entrypoint/filters/not-found.filter';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/modules/app.module';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: true,
      colors: true,
    }),
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('DB_TYPE:', process.env.DB_TYPE);
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('DB_USERNAME:', process.env.DB_USERNAME);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
    console.log('DB_DATABASE:', process.env.DB_DATABASE);
  }

  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new NotFoundDomainExceptionFilter());

  setupValidationPipe(app);
  setupSwagger(app);

  const PORT = process.env.PORT ?? 9100;
  await app.listen(PORT);

  const appUrl = await app.getUrl();

  logger.log(`Application is running on: ${appUrl}`);
  logger.log(
    `Swagger documentation is available at: ${appUrl}/${SWAGGER_PATH}}`,
  );
}
bootstrap();
