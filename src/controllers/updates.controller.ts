import { Router, Request, Response, NextFunction } from 'express';
import { protect } from '../middleware/auth';
import { updateValidateTypes } from '../middleware/validators/updateValidate';
import {
  createUpdate,
  deleteUpdate,
  getUpdate,
  getUpdates,
  update,
} from '../service/update.service';

const router = Router();

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req, res, next);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    await getUpdates(req, res, next);
  }
);

router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req, res, next);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    await getUpdate(req, res, next);
  }
);

router.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req, res, next);
  },
  updateValidateTypes.validateUpdate,
  async (req: Request, res: Response, next: NextFunction) => {
    await createUpdate(req, res, next);
  }
);

router.put(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req, res, next);
  },
  updateValidateTypes.update,
  async (req: Request, res: Response, next: NextFunction) => {
    await update(req, res, next);
  }
);

router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req, res, next);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    await deleteUpdate(req, res, next);
  }
);

export default router;
