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
  
  async findByCurrentDate(symbol: Symbol): Promise<PriceHistory | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.priceHistory.findFirst({
      where: {
        symbol: { equals: symbol },
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findBySymbol(symbol: Symbol): Promise<PriceHistory[]> {
    return this.prisma.priceHistory.findMany({
      where: { symbol: { equals: symbol } },
      orderBy: { date: 'desc' },
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

  @Cron('0 07 16 * * * ' ) // SS:MM:HH 
  async handleCron() {
    const symbols: Symbol[] = [Symbol.ETH];
    const currency: Currency = Currency.USD;

    for (const symbol of symbols) {
      await this.createFromCryptoCompare(symbol, currency);
      Logger.log(`Created price history for ${symbol}`, PriceHistoryService.name);
    }
  }
  
}



