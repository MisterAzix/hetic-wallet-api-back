// nonce.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Nonce = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-nonce'];
  },
);
