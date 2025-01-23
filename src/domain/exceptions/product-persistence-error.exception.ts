export class ProductPersistenceError extends Error {
  constructor(message: string) {
    super(
      `An unexpected error occurred while in persistence product message: ${message}`,
    );
    this.name = 'ProductPersistenceError';
  }
}
