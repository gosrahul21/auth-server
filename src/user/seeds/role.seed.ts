import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { RoleService } from '../role.service';

@Injectable()
export class RoleSeed {
  constructor(private readonly roleService: RoleService) {}

  @Command({ command: 'create:roles', describe: 'create roles' })
  async create() {
    await this.roleService.createRoles({
      name: 'admin',
    });
    await this.roleService.createRoles({
      name: 'user',
    });
  }
}
