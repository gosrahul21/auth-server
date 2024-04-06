import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/common/enum/userroles.enum';

export const Roles = (...args: UserRoles[]) => SetMetadata('roles', args);
