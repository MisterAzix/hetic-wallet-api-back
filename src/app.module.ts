import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from './wallet/wallet.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CryptocompareModule } from './cryptocompare/cryptocompare.module';
import { PriceHistoryModule } from './priceHistory/priceHistory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CryptocompareModule,
    WalletModule,
    PriceHistoryModule
  ],
  controllers: [AppController, PricehistoryController],
  providers: [AppService, PricehistoryService],
})
export class AppModule {}
