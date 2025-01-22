import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { SWAGGER_PATH } from './constants';

export function setupSwagger(app: INestApplication) {
  const swaggerDescription = `API Rest for Tech Challenge of Master's Degree in Software Architecture

  Developed by:

  - Alexandre Miranda - RM357321
  - Diego Ceccon - RM357437
  - Jéssica Rodrigues - RM357218
  - Rodrigo Sartori - RM358002
  - Wilton Souza - RM357991`;

  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../../package.json'), 'utf-8'),
  );

  const config = new DocumentBuilder()
    .setTitle('Tech Challenge FIAP Cook API')
    .setDescription(swaggerDescription)
    .setVersion(packageJson.version)
    .setContact('SOAT 8 Group', '', 'contact@example.com')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document);
}
