import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';

import { i18nValidationMessage } from 'nestjs-i18n';

export const IsRequired = (i18nMessage = 'validation.INVALID_INPUT') => {
  return applyDecorators(
    IsNotEmpty({
      message: i18nValidationMessage(i18nMessage as any),
    }),
  );
};
