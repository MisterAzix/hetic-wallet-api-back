import { Module } from '@nestjs/common';
import { NonceService } from './nonce.service';
import { NonceController } from './nonce.controller';
import { PrismaService } from '../../common/PrismaService';

@Module({
  controllers: [NonceController],
  providers: [NonceService, PrismaService],
  exports: [NonceService],
})
export class NonceModule {}