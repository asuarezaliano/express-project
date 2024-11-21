import { ValidationError } from 'express-validator';

export class CustomError {
  statusCode: number;
  message: ValidationError[] | string;

  constructor(statusCode: number, message: ValidationError[] | string) {
    this.message = message;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
