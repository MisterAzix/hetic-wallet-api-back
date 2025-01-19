import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { GetWalletByAddressResponse } from './response/GetWalletByAddressResponse';
import { NonceGuard } from '../security/nonce/nonce.guard';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('/')
  @UseGuards(NonceGuard)
  async createWallet(
    @Body() body: { address: string; userId: string },
  ): Promise<void> {
    await this.walletService.createWallet(body.address, body.userId);
  }

  @Get('/:address')
  async getWalletByAddress(
    @Param('address') address: string,
  ): Promise<GetWalletByAddressResponse> {
    return await this.walletService.getWalletByAddress(address);
  }

  @Post('/:address')
  @UseGuards(NonceGuard)
  async updateTransactions(@Param('address') address: string): Promise<void> {
    await this.walletService.updateTransactions(address);
  }
}
