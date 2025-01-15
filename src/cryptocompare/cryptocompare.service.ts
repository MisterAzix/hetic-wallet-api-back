import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptocompareService {
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = 'https://min-api.cryptocompare.com/data';
  }

  async getCryptoPrice(crypto: string, currency: string): Promise<any> {
    const apiKey = this.configService.get<string>('CRYPTOCOMPARE_API_KEY');
    const url = `${this.baseUrl}/price?fsym=${crypto}&tsyms=${currency}&api_key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch price: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Error fetching crypto price: ${error.message}`);
    }
  }
}
