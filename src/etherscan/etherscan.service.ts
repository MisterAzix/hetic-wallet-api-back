import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EtherscanService {
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = 'https://api.etherscan.io/api';
  }

  async getTransactions(address: string): Promise<any> {
    const apiKey = this.configService.get<string>('ETHERSCAN_API_KEY');
    const url = `${this.baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
  }

  async getBalance(address: string): Promise<string> {
    const apiKey = this.configService.get<string>('ETHERSCAN_API_KEY');
    const url = `${this.baseUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch balance: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.status !== '1') {
        throw new Error(`Etherscan API Error: ${data.message}`);
      }
      return data.result;
    } catch (error) {
      throw new Error(`Failed to fetch balance: ${error.message}`);
    }
  }
}
