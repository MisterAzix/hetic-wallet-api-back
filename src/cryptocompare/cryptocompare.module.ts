import { Module } from '@nestjs/common';
import { CryptocompareService } from './cryptocompare.service';
import { CryptocompareController } from './cryptocompare.controller';

@Module({
  providers: [CryptocompareService],
  controllers: [CryptocompareController],
  exports: [CryptocompareService], 
})
export class CryptocompareModule {}