import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from '../guards/auth.guard';
import { Role } from './entity/role.entity';

@Controller('applications/:appId/roles')
@UseGuards(AuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getRoles(@Param('appId') appId: string) {
    return this.roleService.getRolesByAppId(appId);
  }

  @Post()
  async createRole(@Param('appId') appId: string, @Body('name') name: string) {
    return this.roleService.createRole({ appId, name } as Role);
  }

  @Put(':roleId')
  async updateRole(
    @Param('appId') appId: string,
    @Param('roleId') roleId: string,
    @Body('name') name: string,
  ) {
    return this.roleService.updateRole(roleId, appId, name);
  }

  @Delete(':roleId')
  async deleteRole(@Param('appId') appId: string, @Param('roleId') roleId: string) {
    return this.roleService.deleteRole(roleId, appId);
  }
}
