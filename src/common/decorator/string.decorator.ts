import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { i18nValidationMessage } from 'nestjs-i18n';

export const IsValidString = (
  min = 4,
  max = 64,
  i18nMessage = 'validation.INVALID_INPUT',
) => {
  return applyDecorators(
    IsNotEmpty({
      message: i18nValidationMessage(i18nMessage as any),
    }),
    IsString,
    MinLength(min),
    MaxLength(max),
  );
};
