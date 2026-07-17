import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entity/application.entity';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { AuthModule } from '../user/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    forwardRef(() => AuthModule),
  ],
  providers: [ApplicationService],
  controllers: [ApplicationController],
  exports: [ApplicationService],
})
export class ApplicationModule {}
