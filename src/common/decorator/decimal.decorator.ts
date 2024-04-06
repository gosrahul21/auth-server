import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

import { i18nValidationMessage } from 'nestjs-i18n';

export const IsValidDecimal = (i18nMessage = 'validation.INVALID_INPUT') => {
  return applyDecorators(
    IsNumber({ maxDecimalPlaces: 6 }),
    Min(1.0),
    IsNotEmpty({
      message: i18nValidationMessage(i18nMessage as any),
    }),
  );
};
