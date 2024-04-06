import { Injectable } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces';
import { Request } from 'express';
import { createInfoLog } from 'src/common/utils/logger';
@Injectable()
export class LoggerGuard {
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    createInfoLog('request recieved', 'LoggerMiddleware', {
      headers: request.headers,
      payload: request.body,
    });
    return true;
  }
}
