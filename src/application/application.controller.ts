import { Controller, Post, Get, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
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

  @Delete(':appId')
  @UseGuards(AuthGuard)
  async deleteApplication(@Req() req: any, @Param('appId') appId: string) {
    const userId = req.user.userId || req.user.id;
    return this.appService.deleteApplication(appId, userId);
  }
}
