import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Role, RoleSchema } from './entity/role.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RoleService } from './role.service';
import { CommandModule } from 'nestjs-command';
import { RoleSeed } from './seeds/role.seed';
import { HttpModule } from '@nestjs/axios';
import { TokenService } from './services/token.service';
import { PasswordService } from './services/password.service';

@Module({
  imports: [
    CommandModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Role.name,
        schema: RoleSchema,
      },
    ]),
    ConfigModule,
    HttpModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RoleService,
    RoleSeed,
    TokenService,
    PasswordService,
  ],
  exports: [AuthService, RoleService, RoleSeed],
})
export class AuthModule {}
