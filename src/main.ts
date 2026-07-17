import * as buffer from 'buffer';
if (!buffer.SlowBuffer) {
  (buffer as any).SlowBuffer = buffer.Buffer;
}

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  I18nValidationExceptionFilter,
  i18nValidationErrorFactory,
} from 'nestjs-i18n';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // CORS configuration for credentials (cookies)
  app.enableCors({
    origin: ['http://localhost:3000', 'https://chat-agent-ui-beryl.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'x-access-token',
      'refresh-token',
    ],
    exposedHeaders: ['Set-Cookie'],
  });

  app.use(cookieParser());
  app.useGlobalFilters(new I18nValidationExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: i18nValidationErrorFactory,
      // whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT);
}
bootstrap();
