import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ApplicationService } from '../application/application.service';

@Injectable()
export class AppOriginGuard implements CanActivate {
  constructor(private readonly applicationService: ApplicationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const appId = request.body?.appId || request.headers['x-app-id'];
    const origin = request.headers['origin'];

    if (!appId) {
      // If no appId is provided, we assume it's the core system or a global login
      return true;
    }

    if (!origin) {
      // Typically non-browser clients (like mobile apps) might not send origin.
      // Depending on strictness, we could block or allow. We'll allow for now.
      return true;
    }

    await this.applicationService.validateOrigin(appId, origin);
    return true;
  }
}
