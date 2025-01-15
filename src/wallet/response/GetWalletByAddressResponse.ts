import { Transaction, Wallet } from '@prisma/client';

export type GetWalletByAddressResponse = Wallet & {
  transactions: Transaction[];
};
