import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Injectable } from "@nestjs/common";
import { createErrorLog } from 'src/common/utils/logger';
import { I18nService } from 'nestjs-i18n';
import * as fs from 'fs';

@Injectable()
export class TokenService {
  private readonly publicKey: string;
  private readonly privateKey: string;
  constructor(private readonly i18nService: I18nService,
    private readonly jwtService: JwtService,
  ) {
    this.publicKey = fs.readFileSync('src/config/public.pem', 'utf-8');
    this.privateKey = fs.readFileSync('src/config/private.pem', 'utf8');
  }

  generateAuthToken(payload: any) {
  
    const accessToken = this.jwtService.sign(payload, {
      secret: this.privateKey,
      // privateKey,
      algorithm: 'RS256',
      expiresIn: process.env.LINK_TOKEN_EXPIRY || '30m',
      allowInsecureKeySizes: true
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.privateKey,
      // privateKey,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '6h',
      algorithm: 'RS256',
      allowInsecureKeySizes: true
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