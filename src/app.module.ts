// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { EtherscanModule } from './etherscan/etherscan.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateLimitModule } from './utils/security/rate-limit';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Rendre ConfigModule global pour éviter de l'importer dans chaque module
    }),
    RateLimitModule, // Importez RateLimitModule pour activer la limitation de débit
  ],
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