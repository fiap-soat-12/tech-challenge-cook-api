import { NotFoundDomainException } from './not-found.exception';

export class ProductNotFoundException extends NotFoundDomainException {
  constructor(productId: string) {
    super(`Product Doesn't Exist with id: ${productId}`);
    this.name = 'ProductNotFoundException';
  }
}
