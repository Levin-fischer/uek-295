import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const port = process.env.PORT || 3000;
  const version = '1.0';

  const author = 'Kursleiter';
  const title = 'my-app';
  const description = 'Eine Beispiel-NestJS-Anwendung';
  const swaggerDocPath = 'docs';

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setContact(author, '', '')
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerDocPath, app, document);
  await app.listen(port);
  Logger.log(`NEST application successfully started`, 'Bootstrap');
  Logger.debug(
    `Server in version: ${version} ist jetzt erreichbar unter
http://localhost:${port}`,
    'Bootstrap',
  );
  Logger.debug(
    `Swagger ist jetzt erreichbar unter
http://localhost:${port}/${swaggerDocPath}`,
    'Bootstrap',
  );
  Logger.log(`Server ist up and running`, 'Bootstrap');
}
bootstrap();
