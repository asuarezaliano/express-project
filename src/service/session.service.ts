import { Request, Response, NextFunction } from 'express';
import prisma from '../db';
import { comparePassword, createJWT } from '../models/auth';
import { CustomError } from '../middleware/error/customError';

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new CustomError(401, 'Invalid credentials');
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      throw new CustomError(401, 'Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = createJWT(user);

    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    next({ error, defaultMessage: 'Internal server error' });
  }
};
