import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PrismaService } from '../common/PrismaService';

@Module({
  providers: [WalletService, PrismaService],
  controllers: [WalletController],
})
export class WalletModule {}
