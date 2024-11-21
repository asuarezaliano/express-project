import { Request, Response, NextFunction } from 'express';
import { createJWT, hashPassword } from '../models/auth';
import prisma from '../db';
import { CustomError } from '../middleware/error/customError';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ data: users });
  } catch (error) {
    next({ error, defaultMessage: 'Error fetching users' });
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    res.json({ data: user });
  } catch (error) {
    next({ error, defaultMessage: 'Error fetching user' });
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashPassword(req.body.password),
      },
    });
    const { password: _, ...userWithoutPassword } = user;
    const token = createJWT(user);
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    next({ error, defaultMessage: 'Error creating user' });
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        username: req.body.username,
        password: req.body.password,
      },
    });
    res.json({ data: user });
  } catch (error) {
    next({ error, defaultMessage: 'Error updating user' });
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next({ error, defaultMessage: 'Error deleting user' });
  }
};
