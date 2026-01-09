// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from './article/article.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'sqlite'>('DB_TYPE', 'sqlite'),
        database: configService.get<string>('DB_DATABASE', 'data/app.db'), // Pfad zur SQLite-Datei
        entities: [],
        autoLoadEntities: true,
        synchronize: true, // DEV ok, PROD besser mit Migrations
        logging: false,
      }),
    }),
    ArticleModule,
    UserModule,
  ],
})
export class AppModule {}
