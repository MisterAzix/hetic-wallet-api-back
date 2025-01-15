import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionNotFound } from './errors/TransactionNotFound';
import { PrismaService } from '../common/PrismaService';
import { WalletNotFound } from './errors/WalletNotFound';
import { GetWalletByAddressResponse } from './response/GetWalletByAddressResponse';
import { Transaction } from '@prisma/client';

@Injectable()
export class WalletService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly apiResponseLengthLimit: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.baseUrl = this.configService.get<string>('ETHERSCAN_BASE_URL');
    this.apiKey = this.configService.get<string>('ETHERSCAN_API_KEY');
    this.apiResponseLengthLimit = this.configService.get<number>(
      'ETHERSCAN_API_RESPONSE_LENGTH_LIMIT',
    );
  }

  async createWallet(address: string): Promise<void> {
    const userId = '40e6215d-b5c6-4896-987c-f30f3678f608';

    await this.prisma.wallet.create({
      data: {
        userId: userId,
        symbol: 'ETH',
        address: address,
      },
    });
  }

  async getWalletByAddress(
    address: string,
  ): Promise<GetWalletByAddressResponse> {
    const wallet = await this.prisma.wallet.findFirst({
      where: {
        address: address,
      },
      include: {
        transactions: true,
      },
    });

    if (!wallet) {
      throw new WalletNotFound(address);
    }

    return wallet;
  }

  async updateTransactions(address: string): Promise<void> {
    const wallet = await this.prisma.wallet.findFirst({
      where: {
        address: address,
      },
    });

    if (!wallet) {
      throw new WalletNotFound(address);
    }

    let startBlock = 0;
    let lastTransactionIndex = -1;
    let hasMoreTransactions = true;
    let balance = 0;

    const lastTransaction = await this.prisma.transaction.findFirst({
      where: {
        walletId: wallet.id,
      },
      orderBy: [
        {
          blockNumber: 'desc',
        },
        {
          transactionIndex: 'desc',
        },
      ],
    });

    if (lastTransaction) {
      startBlock = lastTransaction.blockNumber;
      lastTransactionIndex = lastTransaction.transactionIndex;
      balance = lastTransaction.balance;
    }

    console.log(`Starting updateTransactions for address: ${address}`);
    console.log(
      `Initial startBlock: ${startBlock}, lastTransactionIndex: ${lastTransactionIndex}, balance: ${balance}`,
    );

    while (hasMoreTransactions) {
      const url = new URL(this.baseUrl);
      const params = new URLSearchParams({
        module: 'account',
        action: 'txlist',
        address: address,
        startblock: startBlock.toString(),
        endblock: '99999999',
        sort: 'asc',
        apikey: this.apiKey,
      });
      url.search = params.toString();

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new TransactionNotFound();
        }

        const data = await response.json();
        const transactions = data.result;

        console.log(
          `Fetched ${transactions.length} transactions from block ${startBlock}`,
        );

        if (transactions.length < this.apiResponseLengthLimit) {
          hasMoreTransactions = false;
        }

        for (const tx of transactions) {
          const blockNumber = parseInt(tx.blockNumber);
          const transactionIndex = parseInt(tx.transactionIndex);

          /* console.log(
            `[START] Processing transaction ${tx.hash} at block ${blockNumber}, index ${transactionIndex}`,
          ); */

          if (
            lastTransaction &&
            (blockNumber < lastTransaction.blockNumber ||
              (blockNumber === lastTransaction.blockNumber &&
                transactionIndex <= lastTransactionIndex))
          ) {
            console.log(
              `[SKIP] Skipping transaction ${tx.hash} at block ${blockNumber}, index ${transactionIndex}`,
            );
            continue;
          }

          const value = parseFloat(tx.value);
          const gasUsed = parseFloat(tx.gasUsed);
          const gasPrice = parseFloat(tx.gasPrice);
          const transactionCost = gasUsed * gasPrice;

          if (tx.from.toLowerCase() === address.toLowerCase()) {
            balance -= value + transactionCost;
            console.log(`[INFO] Sent ${value} ETH`);
          } else if (tx.to.toLowerCase() === address.toLowerCase()) {
            balance += value;
            //console.log(`[INFO] Received ${value} ETH`);
          }

          const transaction: Transaction = {
            id: tx.hash,
            userId: wallet.userId,
            walletId: wallet.id,
            blockNumber: blockNumber,
            transactionIndex: transactionIndex,
            balance: balance,
            date: new Date(parseInt(tx.timeStamp) * 1000),
          };

          await this.prisma.transaction.create({
            data: transaction,
          });

          /* console.log(
            `[END] Processed transaction ${tx.hash} at block ${blockNumber}, index ${transactionIndex}`,
          ); */
        }

        if (transactions.length >= this.apiResponseLengthLimit) {
          startBlock =
            parseInt(transactions[transactions.length - 1].blockNumber) + 1;
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        throw new Error('Something went wrong!');
      }
    }

    console.log(`Completed updateTransactions for address: ${address}`);
  }
}
