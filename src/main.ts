// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PasswordService } from './user/password.service';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Wir erstellen die NestJS-Anwendung basierend auf dem AppModule.
  const app = await NestFactory.create(AppModule);
  // gibt einen ConfigService aus der Umgebung
  const configService = app.get<ConfigService>(ConfigService);

  // Wir lesen den Port aus den Umgebungsvariablen aus, standardmäßig verwenden wir Port 3000.
  const port = configService.get<number>('PORT') || 3001;
  const swaggerTitle = configService.get<string>('SWAGGER_TITLE') || 'Example';
  const swaggerDescription =
    configService.get<string>('SWAGGER_DESCRIPTION') || 'The API description';
  // Wir definieren die Version der Anwendung.
  const swaggerVersion = configService.get<string>('SWAGGER_VERSION') || '1.0';
  const swaggerDocPath =
    configService.get<string>('SWAGGER_DOC_PATH') || 'docs';

  // weitere Metadaten
  const authorName =
    configService.get<string>('SWAGGER_AUTHOR_NAME') || 'Kursleiter';
  const authorEmail =
    configService.get<string>('SWAGGER_AUTHOR_EMAIL') || 'coach@ict-uek.ch';
  const authorUrl =
    configService.get<string>('SWAGGER_AUTHOR_URL') || 'https://ict-uek.ch';

  // openApi setup
  const config = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription(swaggerDescription)
    .setContact(authorName, authorUrl, authorEmail)
    .setVersion(swaggerVersion)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerDocPath, app, document);

  // Wir lassen die Anwendung auf dem definierten Port lauschen.
  await app.listen(port);

  // wir verwenden den nestjs Logger, um eine Startmeldung auszugeben. Als zweiter Parameter wird der Kontext 'Bootstrap' übergeben.
  Logger.log(`NEST application successfully started`, bootstrap.name);
  Logger.debug(
    `Server in version: ${swaggerVersion} ist jetzt erreichbar unter http://localhost:${port}`,
    bootstrap.name,
  );
  Logger.debug(
    `Swagger ist jetzt erreichbar unter http://localhost:${port}/${swaggerDocPath}`,
    bootstrap.name,
  );

  // we return the app to be able to add some testdata
  return app;
}
bootstrap()
  .then(async (app: INestApplication) => {
    // you can add some testdata here with different options
    // first we can get the userService from the app and then use it to add some testdata
    // void initialUserLoad(app);

    // an alternate is to access the repository direct, and modify it
    await initialUserLoad(app);
    Logger.log(`Server ist up and running`, 'bootstrap.then');
  })
  .catch((err) => console.error(err));

// initial user load by service
// async function initialUserLoad(app: INestApplication<any>) {
//   const userService: UserService = app.get(UserService);
//   const adminUser = await userService.create({ username: 'admin', email: '', password: '' });
//   await userService.update(adminUser.id, { isAdmin: true });
//   const userUser = await userService.create({ username: 'user', email: '', password: '' });
//   await userService.update(userUser.id, { isAdmin: false });
// }

/**
 * Loads initial user data into the application by creating or replacing specific users.
 * initial user load by direct access to the repository.
 * We ensure the id and password are kept the same
 *
 * @param {INestApplication<any>} app - The NestJS application instance used to access services and repositories.
 */
async function initialUserLoad(app: INestApplication) {
  const passwordService = app.get<PasswordService>(PasswordService);
  const dataSource = app.get(DataSource);
  const userRepo = dataSource.getRepository(UserEntity);
  Logger.debug('initialUserLoad: start', initialUserLoad.name);
  // create or replace the user "admin"
  await userRepoUpdate(passwordService, userRepo, 1, 'admin', true);
  // create or replace the user "user"
  await userRepoUpdate(passwordService, userRepo, 2, 'user', false);
  Logger.debug('initialUserLoad: end', initialUserLoad.name);
}

/**
 * Updates the user repository with the provided user data.
 *
 * @param {PasswordService} passwordService - The password service used to hash the user's password.
 * @param {Repository<UserEntity>} userRepo - The repository instance for managing user entities.
 * @param {number} id - The unique identifier of the user to update.
 * @param {string} username - The username of the user to update and also will be used as password.
 * @param {boolean} isAdmin - The administrative status of the user to update.
 * @param {string} password - The password of the user to update. If not provided, the username will be used as a password.
 */
async function userRepoUpdate(
  passwordService: PasswordService,
  userRepo: Repository<UserEntity>,
  id: number,
  username: string,
  isAdmin: boolean,
  password: string = username,
) {
  // Inserts a given entity into the database, unless a unique constraint conflicts,
  // then updates the entity Unlike save method executes a primitive operation without cascades,
  // relations and other operations included. Executes fast and efficient
  // INSERT ... ON CONFLICT DO UPDATE/ON DUPLICATE KEY UPDATE query.
  Logger.verbose(
    `userRepoUpdate: id=${id}, username=${username}, isAdmin=${isAdmin}, password=${password}`,
    userRepoUpdate.name,
  );
  await userRepo.upsert(
    {
      id,
      username,
      email: `${username}@local.ch`,
      isAdmin: isAdmin ?? false,
      createdById: -1,
      updatedById: -1,
      passwordHash: await passwordService.hashPassword(
        password ? password : username,
      ),
    },
    ['id'],
  );
}
