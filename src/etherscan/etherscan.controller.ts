import { Controller, Get, Query } from '@nestjs/common';
import { EtherscanService } from './etherscan.service';

@Controller('etherscan')
export class EtherscanController {
  constructor(private readonly etherscanService: EtherscanService) {}

  @Get('transactions')
  async getTransactions(@Query('address') address: string) {
    if (!address) {
      return { error: 'Address is required' };
    }

    return await this.etherscanService.getTransactions(address);
  }
}
