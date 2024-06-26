import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import * as fs from 'fs';
import * as path from 'path'

@Injectable()
export class TokenService {
  private readonly publicKey: string;
  private readonly privateKey: string;
  constructor(
    private readonly i18nService: I18nService,
    private readonly jwtService: JwtService,
  ) {
    this.publicKey = fs.readFileSync(path.join(__dirname, '../../config/public.pem'), 'utf-8');
    this.privateKey = fs.readFileSync(path.join(__dirname, '../../config/private.pem'), 'utf8');
  }

  generateAuthToken(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.privateKey,
      // privateKey,
      algorithm: 'RS256',
      expiresIn: process.env.LINK_TOKEN_EXPIRY || '30m',
      allowInsecureKeySizes: true,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.privateKey,
      // privateKey,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '6h',
      algorithm: 'RS256',
      allowInsecureKeySizes: true,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateToken(token) {
    const result = this.jwtService.verify(token, {
      publicKey: this.publicKey,
    });
    return result;
  }
}
