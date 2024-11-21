import { body } from 'express-validator';
import { AddError } from './addError';

const validateUpdatePoint = [
  body('name')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('description')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 2, max: 1000 })
    .withMessage('Description must be between 2 and 1000 characters'),
  body('updateId').isString().trim().notEmpty().withMessage('Update ID is required'),
];

const updatePointValidate = [
  body('name').optional().isString().trim().notEmpty(),
  body('description').optional().isString().trim().notEmpty(),
];

export const updatePointValidateTypes = {
  validateUpdatePoint: AddError(validateUpdatePoint),
  updatePointValidate: AddError(updatePointValidate),
};
