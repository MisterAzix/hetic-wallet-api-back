import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/PrismaService';
import { PriceHistory, Prisma, Symbol } from '@prisma/client';
import { CryptocompareService } from '../cryptocompare/cryptocompare.service';

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
}