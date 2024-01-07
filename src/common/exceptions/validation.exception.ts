import { BadRequestException, ValidationError } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(public errors: ValidationError[]) {
    super();
  }
  override message: string = 'Validation Exception';
}
