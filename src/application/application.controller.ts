import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createApplication(@Req() req: any, @Body('name') name: string) {
    const userId = req.user.userId || req.user.id;
    return this.appService.createApplication(userId, name);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getApplications(@Req() req: any) {
    const userId = req.user.userId || req.user.id;
    return this.appService.getApplicationsByUser(userId);
  }

  @Get(':appId/.well-known/jwks.json')
  async getJwks(@Param('appId') appId: string) {
    // This endpoint is public so client backends can fetch the public key
    return this.appService.getJwks(appId);
  }

  @Get(':appId/public-config')
  async getPublicConfig(@Param('appId') appId: string) {
    return this.appService.getPublicConfig(appId);
  }

  @Delete(':appId')
  @UseGuards(AuthGuard)
  async deleteApplication(@Req() req: any, @Param('appId') appId: string) {
    const userId = req.user.userId || req.user.id;
    return this.appService.deleteApplication(appId, userId);
  }

  @Put(':appId/google-oauth')
  @UseGuards(AuthGuard)
  async updateGoogleOAuth(
    @Req() req: any,
    @Param('appId') appId: string,
    @Body('googleClientId') googleClientId: string,
    @Body('googleClientSecret') googleClientSecret: string,
  ) {
    const userId = req.user.userId || req.user.id;
    return this.appService.updateGoogleOAuth(appId, userId, googleClientId, googleClientSecret);
  }

  @Put(':appId/origins')
  @UseGuards(AuthGuard)
  async updateAllowedOrigins(
    @Req() req: any,
    @Param('appId') appId: string,
    @Body('allowedOrigins') allowedOrigins: string[],
  ) {
    const userId = req.user.userId || req.user.id;
    return this.appService.updateAllowedOrigins(appId, userId, allowedOrigins || []);
  }
}
