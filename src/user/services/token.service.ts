import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class TokenService {
  private readonly jwtSecret: string;
  constructor(
    private readonly i18nService: I18nService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtSecret = process.env.JWT_SECRET || 'super-secret-key-123';
  }

  generateAuthToken(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.jwtSecret,
      algorithm: 'HS256',
      expiresIn: process.env.LINK_TOKEN_EXPIRY || '30m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtSecret,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '6h',
      algorithm: 'HS256',
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateToken(token: string) {
    const result = this.jwtService.verify(token, {
      secret: this.jwtSecret,
    });
    return result;
  }
}
