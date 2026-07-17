import * as buffer from 'buffer';
if (!buffer.SlowBuffer) {
  (buffer as any).SlowBuffer = buffer.Buffer;
}

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import {
  I18nValidationExceptionFilter,
  i18nValidationErrorFactory,
} from 'nestjs-i18n';
import { ApplicationService } from './application/application.service';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useStaticAssets(join(__dirname, '..', 'public'));

  const appService = app.get(ApplicationService);

  // CORS configuration for credentials (cookies)
  app.enableCors({
    origin: async (origin, callback) => {
      // Always allow local UI and main dashboard
      if (!origin || origin === 'http://localhost:3000' || origin === 'https://chat-agent-ui-beryl.vercel.app' || origin === 'http://localhost:5173') {
        return callback(null, true);
      }
      
      const isAllowed = await appService.isOriginGloballyAllowed(origin);
      if (isAllowed) {
        return callback(null, true);
      }
      return callback(new Error('CORS Error: Origin not allowed'));
    },
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
