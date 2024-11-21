import { body } from 'express-validator';
import { AddError } from './addError';
import { UPDATE_STATUS } from '@prisma/client';

const validateUpdate = [
  body('title').exists().isString().trim().notEmpty(),
  body('body').exists().isString().trim().notEmpty(),
  body('status').isIn(Object.values(UPDATE_STATUS)).withMessage('Invalid status value'),
  body('version').exists().isString().trim().notEmpty(),
  body('productId').exists().isString().trim().notEmpty(),
];

const update = [
  body('title').optional().isString().trim().notEmpty(),
  body('body').optional().isString().trim().notEmpty(),
  body('status')
    .optional()
    .isIn(['IN_PROGRESS', 'SHIPPED', 'DEPRECATED'])
    .withMessage('Invalid status value'),
  body('version').optional().isString().trim().notEmpty(),
  body('productId').exists().isString().trim().notEmpty(),
];

export const updateValidateTypes = {
  validateUpdate: AddError(validateUpdate),
  update: AddError(update),
};
