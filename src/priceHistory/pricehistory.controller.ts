import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PriceHistoryService } from './pricehistory.service';
import { Prisma, Symbol, Currency } from '@prisma/client';
import { PriceHistory } from '@prisma/client';

@Controller('pricehistory')
export class PriceHistoryController {
  constructor(private readonly priceHistoryService: PriceHistoryService) {}

  @Get('/:symbol')
  async findBySymbol(@Param('symbol') symbol: Symbol): Promise<PriceHistory[]> {
    return this.priceHistoryService.findBySymbol(symbol);
  }

  @Post('/create-from-crypto')
  async createFromCryptoCompare(
    @Query('symbol') symbol: Symbol,
    @Query('currency') currency: Currency,
  ): Promise<PriceHistory> {
    return this.priceHistoryService.createFromCryptoCompare(symbol, currency);
  }
}