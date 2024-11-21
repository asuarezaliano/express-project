import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { CustomError } from './customError';

export const errorHandler = (error: Error, res: Response, defaultMessage?: string) => {
  console.log({ a: error });

  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }
  //check if this can gave sensitive data
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const field = (error.meta?.modelName as string) || 'field';
      return res.status(400).json({
        error: `${field} already exists`,
      });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Record not found',
      });
    }
  }
  return res.status(500).json({
    error: defaultMessage || 'Internal server error',
  });
};
