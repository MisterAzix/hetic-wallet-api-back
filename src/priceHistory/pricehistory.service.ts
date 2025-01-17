import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/PrismaService';
import { Cron } from '@nestjs/schedule';
import { Symbol, Currency, PriceHistory } from '@prisma/client';
import { CryptocompareService } from '../cryptocompare/cryptocompare.service';

@Injectable()
export class PriceHistoryService {
  constructor(
    private prisma: PrismaService,
    private cryptoService: CryptocompareService,
  ) {}

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


  @Cron('50 40 16 * * * ' ) // SS:MM:HH 
  async handleCron() {
    const symbols: Symbol[] = [Symbol.ETH];
    const currency: Currency = Currency.USD;

    for (const symbol of symbols) {
      await this.createFromCryptoCompare(symbol, currency);
      Logger.log(`Created price history for ${symbol}`, PriceHistoryService.name);
    }
  }

  async findBySymbol(symbol: Symbol) {
    return this.prisma.priceHistory.findMany({
      where: { symbol },
    });
  }

  async findByCurrentDate(symbol: Symbol) {
    const today = new Date();
    return this.prisma.priceHistory.findFirst({
      where: {
        symbol,
        date: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
          lt: new Date(today.setHours(23, 59, 59, 999)),
        },
      },
    });
  }
}