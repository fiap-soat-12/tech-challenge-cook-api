import { NotFoundDomainException } from './not-found.exception';

export class ProductNotFoundException extends NotFoundDomainException {
  constructor(productId: string) {
    super(`Product with id ${productId} not found`);
    this.name = 'ProductNotFoundException';
  }
}
