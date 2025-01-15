export class TransactionNotFound extends Error {
  constructor() {
    super('Transaction not found!');
  }
}
