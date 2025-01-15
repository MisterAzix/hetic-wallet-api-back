import { Controller, Get, Query } from '@nestjs/common';
import { CryptocompareService } from './cryptocompare.service';

@Controller('crypto')
export class CryptocompareController {
  constructor(private readonly cryptoService: CryptocompareService) {}

  @Get('price')
  async getPrice(
    @Query('crypto') crypto: string,
    @Query('currency') currency: string,
  ) {
    if (!crypto || !currency) {
      return { error: 'Both crypto and currency parameters are required' };
    }

    return await this.cryptoService.getCryptoPrice(
      crypto.toUpperCase(),
      currency.toUpperCase(),
    );
  }
}
