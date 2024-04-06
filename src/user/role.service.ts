import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { CreateRoleInput } from './dto/create-role.input';
import { Role, RoleDocument } from './entity/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * Create a new apps
   * @param createRoleInput
   * @returns Promise resolving into newly created apps document
   */
  async createRoles(createRoleInput: CreateRoleInput): Promise<Role> {
    const role = await this.roleModel.create(createRoleInput);
    return role;
  }

  async getRoleById(roleId: Types.ObjectId) {
    const role = await this.roleModel.findById(roleId).lean();
    if (!role)
      throw new NotFoundException(this.i18nService.t('role.ROLE_NOT_FOUND'));
    return role;
  }
}
