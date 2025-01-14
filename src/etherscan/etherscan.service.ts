// src/etherscan/etherscan.service.ts
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

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
  }

  async getInternalTransactions(address: string): Promise<any> {
    const apiKey = this.configService.get<string>('ETHERSCAN_API_KEY');

    const url = `${this.baseUrl}?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch internal transactions: ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(
        `Failed to fetch internal transactions: ${error.message}`,
      );
    }
  }
}
