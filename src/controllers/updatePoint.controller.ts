import { Router, Request, Response, NextFunction } from 'express';
import { protect } from '../models/auth';
import { updatePointValidateTypes } from '../middleware/validators/updatePointValidate';
import {
  createUpdatePoint,
  deleteUpdatePoint,
  getUpdatePoint,
  getUpdatePoints,
  updateUpdatePoint,
} from '../service/updatePoint.service';

const router = Router();

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req, res, next);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    await getUpdatePoints(req, res, next);
  }
);

router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req, res, next);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    await getUpdatePoint(req, res, next);
  }
);

router.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req, res, next);
  },
  updatePointValidateTypes.validateUpdatePoint,
  async (req: Request, res: Response, next: NextFunction) => {
    await createUpdatePoint(req, res, next);
  }
);

router.put(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req, res, next);
  },
  updatePointValidateTypes.updatePointValidate,
  async (req: Request, res: Response, next: NextFunction) => {
    await updateUpdatePoint(req, res, next);
  }
);

router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req, res, next);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    await deleteUpdatePoint(req, res, next);
  }
);

export default router;
