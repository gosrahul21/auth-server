import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  emailOrUserName: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  appId?: string;
}
