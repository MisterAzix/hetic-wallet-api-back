// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EtherscanModule } from './etherscan/etherscan.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EtherscanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
