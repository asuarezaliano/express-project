import { NextFunction, Response, Request } from 'express';
import prisma from '../db';
import { CustomError } from '../middleware/error/customError';

export const getUpdatePoints = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;

    const updatePoints = await prisma.updatePoint.findMany({
      where: {
        update: {
          product: {
            userId: userId,
          },
        },
      },
    });

    res.json({ data: updatePoints });
  } catch (error) {
    next({ error, defaultMessage: 'Error fetching update points' });
  }
};

export const getUpdatePoint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;

    const updatePoint = await prisma.updatePoint.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        update: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!updatePoint) {
      throw new CustomError(404, 'Update point not found');
    }

    if (updatePoint.update.product.userId !== userId) {
      throw new CustomError(403, 'Not authorized to access this update point');
    }

    res.json({ data: updatePoint });
  } catch (error) {
    next({ error, defaultMessage: 'Error fetching update point' });
  }
};

export const createUpdatePoint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const updatePointData = req.body;

    const update = await prisma.update.findUnique({
      where: {
        id: updatePointData.updateId,
      },
      include: {
        product: true,
      },
    });

    if (!update) {
      throw new CustomError(404, 'Update not found');
    }

    if (update.product.userId !== userId) {
      throw new CustomError(403, 'Not authorized to create update point for this update');
    }

    const updatePoint = await prisma.updatePoint.create({
      data: {
        name: updatePointData.name,
        description: updatePointData.description,
        updateId: updatePointData.updateId,
        updatedAt: new Date(),
      },
    });

    res.json({ data: updatePoint });
  } catch (error) {
    next({ error, defaultMessage: 'Error creating update point' });
  }
};

export const updateUpdatePoint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const updatePointId = req.params.id;
    const updatePointData = req.body;

    const updatePoint = await prisma.updatePoint.findUnique({
      where: {
        id: updatePointId,
      },
      include: {
        update: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!updatePoint) {
      throw new CustomError(404, 'Update point not found');
    }

    if (updatePoint.update.product.userId !== userId) {
      throw new CustomError(403, 'Not authorized to update this update point');
    }

    const updatedUpdatePoint = await prisma.updatePoint.update({
      where: {
        id: updatePointId,
      },
      data: {
        name: updatePointData.name,
        description: updatePointData.description,
        updatedAt: new Date(),
      },
    });

    res.json({ data: updatedUpdatePoint });
  } catch (error) {
    next({ error, defaultMessage: 'Error updating update point' });
  }
};

export const deleteUpdatePoint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const updatePointId = req.params.id;

    const updatePoint = await prisma.updatePoint.findUnique({
      where: {
        id: updatePointId,
      },
      include: {
        update: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!updatePoint) {
      throw new CustomError(404, 'Update point not found');
    }

    if (updatePoint.update.product.userId !== userId) {
      throw new CustomError(403, 'Not authorized to delete this update point');
    }

    await prisma.updatePoint.delete({
      where: {
        id: updatePointId,
      },
    });

    res.json({ data: { message: 'Update point deleted successfully' } });
  } catch (error) {
    next({ error, defaultMessage: 'Error deleting update point' });
  }
};
