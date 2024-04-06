import { applyDecorators } from '@nestjs/common';
import { IsInt, IsPositive, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

import { i18nValidationMessage } from 'nestjs-i18n';

export const IsPositiveInteger = (
  min = 1,
  max = 50,
  i18nMessage = 'validation.POSITIVE_NUMBER_REQUIRED',
) => {
  return applyDecorators(
    Type(() => Number),
    IsInt(),
    IsPositive({
      message: i18nValidationMessage(i18nMessage as any),
    }),
    Min(min),
    Max(max),
  );
};
