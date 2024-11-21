import { NextFunction, Response, Request } from 'express';
import prisma from '../db';
import { CustomError } from '../middleware/error/customError';

export const getUpdates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates = await prisma.update.findMany({
      where: {
        product: {
          userId: req.user.id,
        },
      },
    });

    res.json({ data: updates });
  } catch (error) {
    next({ error, defaultMessage: 'Error fetching updates' });
  }
};

export const getUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateId = req.params.id;
    const userId = req.user.id;

    const update = await prisma.update.findUnique({
      where: {
        id: updateId,
      },
      include: {
        product: true,
      },
    });

    if (!update) {
      throw new CustomError(404, 'Update not found');
    }

    if (update.product.userId !== userId) {
      throw new CustomError(403, 'Unauthorized to access this update');
    }

    res.json({ data: update });
  } catch (error) {
    next({ error, defaultMessage: 'Error fetching update' });
  }
};

export const createUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    const product = await prisma.product.findUnique({
      where: {
        id: updateData.productId,
      },
    });

    if (!product) {
      throw new CustomError(404, 'User not found');
    }

    if (product.userId !== userId) {
      throw new CustomError(403, 'Not authorized to create update for this product');
    }

    const update = await prisma.update.create({
      data: {
        title: updateData.title,
        body: updateData.body,
        status: updateData.status,
        version: updateData.version,
        asset: updateData.asset,
        productId: updateData.productId,
        updatedAt: new Date(),
      },
    });

    res.json({ data: update });
  } catch (error) {
    next({ error, defaultMessage: 'Error creating update' });
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const updateId = req.params.id;
    const updateData = req.body;

    const product = await prisma.product.findUnique({
      where: {
        id: updateData.productId,
        userId: userId,
      },
    });

    if (!product) {
      throw new CustomError(404, 'product not found');
    }

    const updatedUpdate = await prisma.update.update({
      where: {
        id: updateId,
      },
      data: {
        title: updateData.title,
        body: updateData.body,
        status: updateData.status,
        version: updateData.version,
        asset: updateData.asset,
        updatedAt: new Date(),
      },
    });

    res.json({ data: updatedUpdate });
  } catch (error) {
    next({ error, defaultMessage: 'Error updating record' });
  }
};

export const deleteUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateId = req.params.id;
    const userId = req.user.id;
    const update = await prisma.update.findUnique({
      where: {
        id: updateId,
      },
      include: {
        product: true,
      },
    });

    if (!update) {
      throw new CustomError(404, 'Update not found');
    }

    if (update.product.userId !== userId) {
      throw new CustomError(404, 'Update not found');
    }

    const deletedUpdate = await prisma.update.delete({
      where: {
        id: updateId,
      },
    });

    res.json({ data: deletedUpdate });
  } catch (error) {
    next({ error, defaultMessage: 'Error deleting update' });
  }
};
