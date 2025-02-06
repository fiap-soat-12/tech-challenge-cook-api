export class OrderPersistenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderPersistenceError';
  }
}
