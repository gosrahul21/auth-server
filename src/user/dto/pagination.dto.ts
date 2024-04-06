import { IsNumberString } from "class-validator";

export class PaginationDto {
    @IsNumberString()
    page: number = 1;

    @IsNumberString()
    limit: number = 5;
}