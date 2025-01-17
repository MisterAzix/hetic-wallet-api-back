import { Module } from '@nestjs/common';
import { PriceHistoryService } from './pricehistory.service';
import { PriceHistoryController } from './pricehistory.controller';
import { PrismaService } from '../common/PrismaService';
import { CryptocompareModule } from '../cryptocompare/cryptocompare.module';

@Module({
  imports: [CryptocompareModule], 
  controllers: [PriceHistoryController],
  providers: [PriceHistoryService, PrismaService],
})
export class PriceHistoryModule {}