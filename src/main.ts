import { GLOBAL_PREFIX, SWAGGER_PATH } from '@infrastructure/config/constants';
import { setupSwagger } from '@infrastructure/config/swagger.config';
import { setupValidationPipe } from '@infrastructure/config/validation-pipe.config';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/modules/app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: true,
      colors: true,
    }),
  });
  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.enableCors();

  setupValidationPipe(app);
  setupSwagger(app);

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);

  const appUrl = await app.getUrl();

  logger.log(`Application is running on: ${appUrl}`);
  logger.log(
    `Swagger documentation is available at: ${appUrl}/${SWAGGER_PATH}}`,
  );
}
bootstrap();
