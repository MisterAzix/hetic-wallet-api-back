// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EtherscanModule } from './etherscan/etherscan.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CryptocompareModule } from './cryptocompare/cryptocompare.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EtherscanModule,
    CryptocompareModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
