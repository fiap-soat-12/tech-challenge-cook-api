import { ConflictException } from '@nestjs/common';

export class OrderAlreadyExistsException extends ConflictException {
  constructor(orderId: string) {
    super(`Order already exists with id: ${orderId}`);
    this.name = 'OrderAlreadyExistsException';
  }
}
