import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  emailOrUserName: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
