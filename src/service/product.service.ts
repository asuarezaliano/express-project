import { Request, Response, NextFunction } from 'express';
import prisma from '../db';
import { CustomError } from '../middleware/error/customError';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany();
    res.json({ data: products });
  } catch (error) {
    next({ error, defaultMessage: 'Error fetching users' });
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
    });

    res.json({ data: product });
  } catch (error) {
    next({ error, defaultMessage: 'Error fetching product' });
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        price: req.body.price,
        userId: req.user.id,
      },
    });
    res.json({ data: product });
  } catch (error) {
    next({ error, defaultMessage: 'Error creating product' });
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.update({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      data: {
        name: req.body.name,
        price: req.body.price,
      },
    });
    res.json({ data: product });
  } catch (error) {
    next({ error, defaultMessage: 'Error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.product.delete({
      where: {
        id_userId: {
          id: req.params.id,
          userId: req.user.id,
        },
      },
    });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next({ error, defaultMessage: 'Error deleting product' });
  }
};
