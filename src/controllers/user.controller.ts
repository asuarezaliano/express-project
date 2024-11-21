import { Router, Request, Response, NextFunction } from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../service/user.service';
import { protect } from '../models/auth';
import { userValidateTypes } from '../middleware/validators/userValidations';

const router = Router();

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    await protect(req, res, next);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    await getUsers(req, res, next);
  }
);

router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req, res, next);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    await getUser(req, res, next);
  }
);

router.post(
  '',
  userValidateTypes.validateUser,
  async (req: Request, res: Response, next: NextFunction) => {
    await createUser(req, res, next);
  }
);

router.put(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req, res, next);
  },
  userValidateTypes.validateUpdateUser,
  async (req: Request, res: Response, next: NextFunction) => {
    await updateUser(req, res, next);
  }
);

router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req, res, next);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    await deleteUser(req, res, next);
  }
);

export default router;
