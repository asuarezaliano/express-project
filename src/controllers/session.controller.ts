import express, { Request, Response, NextFunction } from 'express';
import { signin } from '../service/session.service';

const router = express.Router();

router.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
  await signin(req, res, next);
});

export default router;
