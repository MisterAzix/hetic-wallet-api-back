import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/PrismaService';
import { PriceHistory, Prisma, Symbol } from '@prisma/client';

@Injectable()
export class PriceHistoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PriceHistoryCreateInput): Promise<PriceHistory> {
    return this.prisma.priceHistory.create({ data });
  }

  async findBySymbol(symbol: Symbol): Promise<PriceHistory[]> {
    return this.prisma.priceHistory.findMany({
      where: { symbol: { equals: symbol } },
    });
  }
}