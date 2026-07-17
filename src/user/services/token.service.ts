import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ApplicationService } from '../../application/application.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TokenService {
  private readonly globalPublicKey: string;
  private readonly globalPrivateKey: string;

  constructor(
    private readonly i18nService: I18nService,
    private readonly jwtService: JwtService,
    private readonly applicationService: ApplicationService,
  ) {
    try {
      this.globalPublicKey = (process.env.GLOBAL_PUBLIC_KEY || '').replace(/\\n/g, '\n');
      this.globalPrivateKey = (process.env.GLOBAL_PRIVATE_KEY || '').replace(/\\n/g, '\n');
      
      if (!this.globalPublicKey || !this.globalPrivateKey) {
        console.warn("Global keys not found in environment, proceeding without them. Only app-specific logins will work.");
      }
    } catch (err) {
      console.warn("Error parsing global keys from environment.");
    }
  }

  async generateAuthToken(payload: any) {
    let privateKey = this.globalPrivateKey;
    
    // If the payload is for a specific application, use its private key
    if (payload.appId) {
      const app = await this.applicationService.getApplicationByAppId(payload.appId);
      if (app && app.privateKey) {
        privateKey = app.privateKey;
      }
    }

    if (!privateKey) {
      throw new Error("Cannot generate token: No private key available.");
    }

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: privateKey,
      algorithm: 'RS256',
      expiresIn: process.env.LINK_TOKEN_EXPIRY || '30m',
      allowInsecureKeySizes: true,
    });
    
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: privateKey,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '6h',
      algorithm: 'RS256',
      allowInsecureKeySizes: true,
    });
    
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateToken(token: string) {
    // Decode first to get the appId without validating signature yet
    const decoded: any = this.jwtService.decode(token);
    if (!decoded) {
      throw new UnauthorizedException('Invalid token structure');
    }

    let publicKey = this.globalPublicKey;

    if (decoded.appId) {
      const app = await this.applicationService.getApplicationByAppId(decoded.appId);
      if (app && app.publicKey) {
        publicKey = app.publicKey;
      }
    }

    if (!publicKey) {
      throw new UnauthorizedException('Cannot validate token: No public key available.');
    }

    // Now verify the signature cryptographically
    return await this.jwtService.verifyAsync(token, {
      publicKey: publicKey,
      algorithms: ['RS256']
    });
  }
}
