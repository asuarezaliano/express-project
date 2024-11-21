import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

interface AuthUser extends Pick<User, 'id' | 'username'> {}

declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
    }
  }
}

export const createJWT = (user: User) => {
  const payload = {
    id: user.id,
    username: user.username,
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers['authorization'];
  if (!bearer) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const [, token] = bearer.split(' ');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 5);
};
