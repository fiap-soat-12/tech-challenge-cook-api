export class NotFoundDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundDomainException';
  }
}
