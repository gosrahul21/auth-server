import { IsNumberString } from 'class-validator';

export class PaginationDto {
  @IsNumberString()
  page = 1;

  @IsNumberString()
  limit = 5;
}
