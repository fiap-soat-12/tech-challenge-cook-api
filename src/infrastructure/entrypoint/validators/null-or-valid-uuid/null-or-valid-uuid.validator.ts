import { UUID } from '@application/types/UUID.type';
import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { validate as isUUID } from 'uuid';

@ValidatorConstraint({ async: false })
export class NullOrValidUUIDConstraint implements ValidatorConstraintInterface {
  validate(value: UUID): boolean {
    return value === null || value === undefined || isUUID(value);
  }

  defaultMessage(): string {
    return 'Not a valid UUID';
  }
}

export function NullOrValidUUID(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: NullOrValidUUIDConstraint,
    });
  };
}

export class UUIDValidationPipe implements PipeTransform {
  transform(value: UUID, metadata: ArgumentMetadata) {
    if (!isUUID(value)) {
      throw new BadRequestException('Not a valid UUID');
    }
    return value;
  }
}
