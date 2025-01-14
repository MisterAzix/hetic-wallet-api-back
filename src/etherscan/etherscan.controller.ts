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

  @Get('balance')
  async getBalance(@Query('address') address: string) {
    if (!address) {
      return { error: 'Address is required' };
    }
    const balanceWei = await this.etherscanService.getBalance(address);
    const balanceEther = parseFloat(balanceWei) / 1e18; // Convertir wei en ether
    return { balanceEther, balanceWei };
  }
}
