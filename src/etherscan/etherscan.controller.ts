// src/etherscan/etherscan.controller.ts
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

  @Get('internal-transactions')
  async getInternalTransactions(@Query('address') address: string) {
    if (!address) {
      return { error: 'Address is required' };
    }

    return await this.etherscanService.getInternalTransactions(address);
  }
}
