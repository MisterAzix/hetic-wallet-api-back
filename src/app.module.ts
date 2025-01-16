import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from './wallet/wallet.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateLimitModule } from './security/rate-limit';
import { CryptocompareModule } from './cryptocompare/cryptocompare.module';
import { EtherscanModule } from './etherscan/etherscan.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './common/PrismaService';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EtherscanModule,
    RateLimitModule,
    CryptocompareModule,
    WalletModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
