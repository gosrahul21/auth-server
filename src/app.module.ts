import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './user/auth.module';
import { ConfigModule } from '@nestjs/config';
import { getMongoUrl } from './common/utils/getMongoUrl';
import { MongooseModule } from '@nestjs/mongoose';
import { I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(getMongoUrl()),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/translation/'),
        watch: true,
      },
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_PRIVATE_KEY,
      signOptions: { expiresIn: process.env.EXPIRE_TIME },
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
