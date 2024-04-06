import {
  IsStrongPassword,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @IsNotEmpty({
    message: i18nValidationMessage('validation.FIRSTNAME_REQUIRED'),
  })
  @MaxLength(32, {
    message: i18nValidationMessage('validation.FIRSTNAME_MAX_LENGTH'),
  })
  userName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.FIRSTNAME_REQUIRED'),
  })
  @MaxLength(32, {
    message: i18nValidationMessage('validation.FIRSTNAME_MAX_LENGTH'),
  })
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.LASTNAME_REQUIRED'),
  })
  @MaxLength(32, {
    message: i18nValidationMessage('validation.LASTNAME_MAX_LENGTH'),
  })
  lastName?: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.EMAIL_REQUIRED'),
  })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('validation.INVALID_EMAIL'),
    },
  )
  email: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.PASSWORD_REQUIRED'),
  })
  @MinLength(8, {
    message: i18nValidationMessage('validation.PASSWORD_MIN_LENGTH'),
  })
  @IsStrongPassword()
  password: string;
}
