import { Request, Response, NextFunction } from 'express';
import { AddError } from '../addError';
import { CustomError } from '../../error/customError';

jest.mock('express-validator', () => ({
  validationResult: jest.fn().mockReturnValue({
    isEmpty: () => false,
    array: () => [{ msg: 'Error message' }],
  }),
  body: jest.fn().mockReturnValue({
    notEmpty: () => ({ notEmpty: true }),
    custom: (fn: any) => ({ custom: fn }),
  }),
}));

import { body, validationResult } from 'express-validator';

describe('AddError middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next() when validation passes', async () => {
    const validateNameArray = [body('name').notEmpty()];
    mockReq.body = { name: 'Test Name' };
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    const middleware = AddError(validateNameArray);
    await middleware[1](mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should call next with error when validation fails', async () => {
    const validateNameArray = [body('name').notEmpty()];
    mockReq.body = { name: '' };

    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'Name is required' }],
    });

    const middleware = AddError(validateNameArray);
    await middleware[1](mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      error: expect.any(CustomError),
    });
  });

  it('should handle unexpected errors', async () => {
    const validateNameArray = [
      body('name').custom(() => {
        throw new Error('Unexpected error');
      }),
    ];
    mockReq.body = { name: 'Test' };

    const middleware = AddError(validateNameArray);
    await middleware[1](mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      error: expect.any(CustomError),
    });
  });
});
