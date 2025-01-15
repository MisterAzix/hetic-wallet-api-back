import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from './wallet/wallet.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateLimitModule } from './security/rate-limit';
import { CryptocompareModule } from './cryptocompare/cryptocompare.module';
import { EtherscanModule } from './etherscan/etherscan.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EtherscanModule,
    RateLimitModule,
    CryptocompareModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
