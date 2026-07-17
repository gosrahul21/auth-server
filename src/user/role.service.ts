import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Role } from './entity/role.entity';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly i18nService: I18nService,
  ) {}

  async createRole(role: Role) {
    const createdRole = this.roleRepository.create(role);
    return await this.roleRepository.save(createdRole);
  }

  async getRoleByValue(roleValue: string, appId?: string) {
    const roleDetails = await this.roleRepository.findOne({
      where: { name: roleValue, appId: appId ? appId : IsNull() },
    });
    if (roleDetails) return roleDetails;
    throw new NotFoundException(this.i18nService.t('role.NOT_FOUND'));
  }

  async getRoleById(roleId: string) {
    const roleDetails = await this.roleRepository.findOne({
      where: { id: roleId },
    });
    if (roleDetails) return roleDetails;
    throw new NotFoundException(this.i18nService.t('role.NOT_FOUND'));
  }

  async getRolesByAppId(appId: string) {
    return this.roleRepository.find({
      where: { appId },
      order: { createDate: 'ASC' },
    });
  }

  async updateRole(roleId: string, appId: string, newName: string) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId, appId },
    });
    
    if (!role) {
      throw new NotFoundException('Role not found for this application');
    }
    
    role.name = newName;
    return this.roleRepository.save(role);
  }

  async deleteRole(roleId: string, appId: string) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId, appId },
    });

    if (!role) {
      throw new NotFoundException('Role not found for this application');
    }

    await this.roleRepository.remove(role);
    return { message: 'Role deleted successfully' };
  }
}
