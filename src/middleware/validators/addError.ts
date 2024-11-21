import { NextFunction, Response, Request } from 'express';
import { validationResult } from 'express-validator';
import { CustomError } from '../error/customError';

export const AddError = (validate: any[]) => [
  ...validate,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new CustomError(400, errors.array());
      }
      next();
    } catch (error) {
      next({ error });
    }
  },
];
