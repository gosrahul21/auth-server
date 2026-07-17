import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Role } from './entity/role.entity';
import { AuthController } from './auth.controller';
import { RoleController } from './role.controller';
import { AuthService } from './auth.service';
import { RoleService } from './role.service';
import { CommandModule } from 'nestjs-command';
import { RoleSeed } from './seeds/role.seed';
import { HttpModule } from '@nestjs/axios';
import { TokenService } from './services/token.service';
import { PasswordService } from './services/password.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [
    CommandModule,
    TypeOrmModule.forFeature([User, Role]),
    ConfigModule,
    HttpModule,
    JwtModule,
    PassportModule.register({ defaultStrategy: 'google' }),
    forwardRef(() => ApplicationModule),
  ],
  controllers: [AuthController, RoleController],
  providers: [
    AuthService,
    RoleService,
    RoleSeed,
    TokenService,
    PasswordService,
    GoogleStrategy,
  ],
  exports: [AuthService, RoleService, RoleSeed, TokenService],
})
export class AuthModule {}
