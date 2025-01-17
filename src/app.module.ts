import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from './wallet/wallet.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateLimitModule } from './security/rate-limit';
import { CryptocompareModule } from './cryptocompare/cryptocompare.module';
import { PriceHistoryModule } from './priceHistory/priceHistory.module';
import { EtherscanModule } from './etherscan/etherscan.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './common/PrismaService';
import { NonceModule } from './security/nonce/nonce.module';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EtherscanModule,
    RateLimitModule,
    CryptocompareModule,
    WalletModule,
    PriceHistoryModule,
    AuthModule,
    NonceModule, 
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}