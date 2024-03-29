import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER } from '@nestjs/core';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import 'dotenv/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReaderModule } from './reader/reader.module';
import { AuthModule } from './auth/auth.module';
import { HttpExceptionFilter } from './common/http-excetption.filter';
import { LibrarianModule } from './librarian/librarian.module';
import { BookModule } from './book/book.module';
import { WorkshopModule } from './workshop/workshop.module';
import { BlogModule } from './blog/blog.module';
import { join } from 'path';
import { FrontLogModule } from './front-log/front-log.module';
import { EmailerModule } from './emailer/emailer.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri:
          process.env.NODE_ENV === 'production'
            ? process.env.MONGO_PROD_URI
            : process.env.NODE_ENV === 'development'
              ? process.env.MONGO_DEV_URI
              : process.env.MONGO_TEST_URI,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }),
    }),
    WinstonModule.forRoot({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.File({ filename: 'combined.log', level: 'info' }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'bookfiles'),
      exclude: ['/api*'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'otherfiles'),
      serveRoot: '/otherfiles',
      exclude: ['/api*'],
    }),
    ReaderModule,
    AuthModule,
    LibrarianModule,
    BookModule,
    WorkshopModule,
    BlogModule,
    FrontLogModule,
    EmailerModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: Number(process.env.MAIL_PORT),
          secure: false,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        },
        defaults: {
          from: '"No Reply" <noreply@anlubiblio.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule { }
