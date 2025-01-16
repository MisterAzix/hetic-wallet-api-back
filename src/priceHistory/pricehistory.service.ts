import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/PrismaService';
import { PriceHistory, Prisma, Symbol, Currency } from '@prisma/client';
import { CryptocompareService } from '../cryptocompare/cryptocompare.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PriceHistoryService {
  constructor(
    private prisma: PrismaService,
    private cryptoService: CryptocompareService,
  ) {}

  async findBySymbol(symbol: Symbol): Promise<PriceHistory[]> {
    return this.prisma.priceHistory.findMany({
      where: { symbol: { equals: symbol } },
    });
  }

  async createFromCryptoCompare(symbol: Symbol, currency: 'USD'): Promise<PriceHistory> {
    const priceData = await this.cryptoService.getCryptoPrice(symbol, currency);
    const price = priceData[currency];

    const priceHistory = await this.prisma.priceHistory.create({
      data: {
        symbol,
        currency,
        price,
        date: new Date(),
      },
    });

    return priceHistory;
  }

  @Cron('0 50 9 * * * ' )
  async handleCron() {
    const symbols: Symbol[] = [Symbol.ETH, Symbol.BTC];
    const currency: Currency = Currency.USD;

    for (const symbol of symbols) {
      await this.createFromCryptoCompare(symbol, currency);
      Logger.log(`Created price history for ${symbol}`, PriceHistoryService.name);
    }
  }
  
}



