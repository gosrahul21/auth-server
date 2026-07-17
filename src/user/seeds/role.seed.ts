import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { RoleService } from '../role.service';

@Injectable()
export class RoleSeed {
  constructor(private readonly roleService: RoleService) {}

  @Command({ command: 'create:roles', describe: 'create roles' })
  async seedRoles() {
    await this.roleService.createRole({
      name: 'User',
    } as any);
    await this.roleService.createRole({
      name: 'Admin',
    } as any);
  }
}
