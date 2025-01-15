export class WalletNotFound extends Error {
  constructor(address: string) {
    super(`Wallet with address ${address} not found!`);
  }
}
