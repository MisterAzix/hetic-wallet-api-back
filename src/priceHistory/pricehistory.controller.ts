import { Controller, Get, Param } from '@nestjs/common';
import { PriceHistoryService } from './pricehistory.service';
import { Symbol } from '@prisma/client';
import { PriceHistory } from '@prisma/client';

@Controller('pricehistory')
export class PriceHistoryController {
  constructor(private readonly priceHistoryService: PriceHistoryService) {}

  @Get('/:symbol')
  async findBySymbol(@Param('symbol') symbol: Symbol): Promise<PriceHistory[]> {
    return this.priceHistoryService.findBySymbol(symbol);
  }
  @Get('/current/:symbol')
  async findByCurrentDate(
    @Param('symbol') symbol: Symbol,
  ): Promise<PriceHistory> {
    return this.priceHistoryService.findByCurrentDate(symbol);
  }
}
