import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { createErrorLog } from 'src/common/utils/logger';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class PasswordService {
  constructor(
    private readonly i18nService: I18nService,
    private readonly jwtService: JwtService,
  ) {}

  async createPasswordHash(password: string) {
    try {
      // generate random salt
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      return passwordHash;
    } catch (error) {
      createErrorLog(
        `${this.i18nService.t('user.PASSWORD_GEN_ERROR')}`,
        'auth-service',
        {
          error: error?.message,
        },
      );
      throw error;
    }
  }

  async comparePasswords(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
