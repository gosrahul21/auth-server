import { IsEnum, IsMongoId } from 'class-validator';
import { UserStatus } from 'src/common/enum/user-status.enum';

export class ApproveUserDto {
  @IsMongoId()
  userId: string;

  @IsEnum(UserStatus)
  status: UserStatus;
}
