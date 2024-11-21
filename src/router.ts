import { Router } from 'express';
import userRouter from './controllers/user.controller';
import productRouter from './controllers/product.controller';
import sessionRouter from './controllers/session.controller';
import updateRouter from './controllers/updates.controller';
import updatePointRouter from './controllers/updatePoint.controller';
const router = Router();

router.use('/users', userRouter);
router.use('/product', productRouter);
router.use('/session', sessionRouter);
router.use('/updates', updateRouter);
router.use('/updatePoints', updatePointRouter);
export default router;
