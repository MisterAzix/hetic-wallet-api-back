import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PriceHistoryService } from './pricehistory.service';
import { Prisma, Symbol } from '@prisma/client';
import { PriceHistory } from '@prisma/client';

@Controller('pricehistory')
export class PriceHistoryController {
  constructor(private readonly priceHistoryService: PriceHistoryService) {}

  @Post('/')
  async create(@Body() createPriceHistoryDto: Prisma.PriceHistoryCreateInput): Promise<PriceHistory> {
    return this.priceHistoryService.create(createPriceHistoryDto);
  }

  @Get('/:symbol')
  async findBySymbol(@Param('symbol') symbol: Symbol): Promise<PriceHistory[]> {
    return this.priceHistoryService.findBySymbol(symbol);
  }
}