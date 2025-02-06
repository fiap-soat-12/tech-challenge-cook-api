import { NotFoundDomainException } from './not-found.exception';

export class OrderNotFoundException extends NotFoundDomainException {
  constructor(orderId: string) {
    super(`Order with ID ${orderId} not found`);
    this.name = 'OrderNotFoundException';
  }
}
