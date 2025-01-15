import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { GetWalletByAddressResponse } from './response/GetWalletByAddressResponse';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('/')
  async createWallet(@Body() body: { address: string }): Promise<void> {
    await this.walletService.createWallet(body.address);
  }

  @Get('/:address')
  async getWalletByAddress(
    @Param('address') address: string,
  ): Promise<GetWalletByAddressResponse> {
    return await this.walletService.getWalletByAddress(address);
  }

  @Post('/:address')
  async updateTransactions(@Param('address') address: string): Promise<void> {
    await this.walletService.updateTransactions(address);
  }
}
