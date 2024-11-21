import { body } from 'express-validator';
import { AddError } from './addError';

export const validateUser = [
  body('username')
    .isString()
    .trim()
    .notEmpty()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Username must be between 2 and 255 characters'),
  body('password')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6, max: 255 })
    .withMessage('Password must be between 6 and 255 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
];

export const validateUpdateUser = [
  body('password')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6, max: 255 })
    .withMessage('Password must be between 6 and 255 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
];

export const userValidateTypes = {
  validateUpdateUser: AddError(validateUpdateUser),
  validateUser: AddError(validateUser),
};
