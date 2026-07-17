import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class GoogleTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsOptional()
  @IsString()
  appId?: string;
}
