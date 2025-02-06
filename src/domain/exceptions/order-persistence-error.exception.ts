export class OrderPersistenceError extends Error {
  constructor(message: string) {
    super(
      `An unexpected error occurred while in persistence order message: ${message}`,
    );
    this.name = 'OrderPersistenceError';
  }
}
