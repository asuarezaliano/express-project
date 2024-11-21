import { body } from 'express-validator';
import { AddError } from './addError';

const validateProduct = [
  body('name')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('price')
    .isNumeric()
    .trim()
    .notEmpty()
    .withMessage('Price is required')
    .isInt({ min: 1, max: 999999 })
    .withMessage('Price must be between 1 and 999999')
    .toInt(),
];

export const productValidateTypes = {
  validateProduct: AddError(validateProduct),
};
