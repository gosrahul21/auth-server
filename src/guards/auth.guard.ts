import { TokenService } from 'src/user/services/token.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Reflector } from '@nestjs/core';
import { RolesEnum } from 'src/common/enum/roles.enum';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    @Inject(I18nService) private i18nService: I18nService,
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token =
      request.headers['x-access-token'] || request.headers['authorization'];
    if (token == null) {
      throw new UnauthorizedException(
        this.i18nService.t('default.GUARD_TOKEN_REQUIRED'),
      );
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    let result;
    if (token) {
      try {
        const cachedSession = await this.cacheManager.get(`session:${token}`);
        if (!cachedSession) {
          throw new UnauthorizedException('Session expired or invalid');
        }
        result = await this.tokenService.validateToken(token);
      } catch (error) {
        throw new UnauthorizedException(
          this.i18nService.t('default.GUARD_TOKEN_INVALID'),
        );
      }

      const roles: RolesEnum[] = this.reflector.get(
        'roles',
        context.getHandler(),
      ); // authorized roles
      
      request.user = result; // Add user payload to request
      request.decoded = result; // Keep backwards compatibility
      
      if (
        !roles ||
        roles.length === 0 ||
        (result.roles && roles.some((role) => result.roles.includes(role)))
      ) {
        return true;
      } else {
        throw new UnauthorizedException(
          this.i18nService.t('validation.ROLES_AUTHORIZATION_FAILED'),
        );
      }
    } else {
      throw new UnauthorizedException(
        this.i18nService.t('default.GUARD_TOKEN_INVALID'),
      );
    }
  }
}
