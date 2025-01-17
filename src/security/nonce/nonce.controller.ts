import { Controller, Get } from '@nestjs/common';
import { NonceService } from './nonce.service';

@Controller('nonce')
export class NonceController {
  constructor(private readonly nonceService: NonceService) {}

  @Get('/')
  async generateNonce(): Promise<{ nonce: string }> {
    const nonce = await this.nonceService.generateNonce();
    return { nonce };
  }
}