import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entity/application.entity';
import * as crypto from 'crypto';
import { RoleService } from '../user/role.service';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private appRepository: Repository<Application>,
    private roleService: RoleService,
  ) {}

  async createApplication(userId: string, name: string) {
    const appId = crypto.randomUUID();
    
    // Generate RSA key pair for the application
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    const application = this.appRepository.create({
      userId,
      name,
      appId,
      privateKey,
      publicKey,
      allowedOrigins: [],
    });

    await this.appRepository.save(application);

    // Create default roles for the application
    await this.roleService.createRole({ name: 'admin', appId } as any);
    await this.roleService.createRole({ name: 'user', appId } as any);

    // Return the application (excluding private key for safety in response, though it's saved)
    const { privateKey: _, ...appWithoutPrivateKey } = application;
    return appWithoutPrivateKey;
  }

  async getApplicationsByUser(userId: string) {
    const apps = await this.appRepository.find({ where: { userId } });
    return apps.map(({ privateKey, ...app }) => app);
  }

  async getApplicationByAppId(appId: string) {
    const app = await this.appRepository.findOne({ where: { appId } });
    if (!app) {
      throw new NotFoundException('Application not found');
    }
    return app;
  }

  async getPublicConfig(appId: string) {
    const app = await this.getApplicationByAppId(appId);
    return {
      appId: app.appId,
      name: app.name,
      googleClientId: app.googleClientId
    };
  }

  async deleteApplication(appId: string, userId: string) {
    const app = await this.getApplicationByAppId(appId);
    if (app.userId !== userId) {
      throw new UnauthorizedException('You can only delete applications you own');
    }
    await this.appRepository.remove(app);
    return { message: 'Application deleted successfully' };
  }

  async getApplicationPrivateKey(appId: string) {
    const app = await this.getApplicationByAppId(appId);
    return app.privateKey;
  }

  async getJwks(appId: string) {
    const app = await this.getApplicationByAppId(appId);
    
    // Convert PEM Public Key to JWK
    // For a production setup, consider using a library like 'pem-jwk' or 'node-jose'
    // Here we wrap it in the basic JWKS structure
    const publicKeyObject = crypto.createPublicKey(app.publicKey);
    const jwk = publicKeyObject.export({ format: 'jwk' });
    
    return {
      keys: [
        {
          kty: jwk.kty,
          n: jwk.n,
          e: jwk.e,
          alg: 'RS256',
          use: 'sig',
          kid: `${appId}-key-1`
        }
      ]
    };
  }

  async validateOrigin(appId: string, origin: string) {
    const app = await this.getApplicationByAppId(appId);
    if (!app.allowedOrigins || app.allowedOrigins.length === 0) {
      return true;
    }
    if (!app.allowedOrigins.includes(origin)) {
      throw new UnauthorizedException('Origin not allowed for this application');
    }
    return app;
  }

  async updateGoogleOAuth(appId: string, userId: string, googleClientId: string, googleClientSecret: string) {
    const app = await this.getApplicationByAppId(appId);
    if (app.userId !== userId) {
      throw new UnauthorizedException('You can only update applications you own');
    }
    app.googleClientId = googleClientId;
    app.googleClientSecret = googleClientSecret;
    await this.appRepository.save(app);
    return { message: 'Google OAuth configuration updated successfully' };
  }
}
