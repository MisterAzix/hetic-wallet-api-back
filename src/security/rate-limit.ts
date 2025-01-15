import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 36000,
      limit: 120,
    }]),
  ],
})
export class RateLimitModule {}