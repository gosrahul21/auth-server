import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { UserStatus } from 'src/common/enum/user-status.enum';
import { PaginationDto } from './pagination.dto';
import { SortType } from 'src/common/enum/sort.enum';

export class GetUserDto extends PartialType(PaginationDto) {
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @IsNumberString()
  @IsOptional()
  sortByDate: SortType; // -1 for descendingor 1 for ascending
}
