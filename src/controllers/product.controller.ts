import { Router, Request, Response, NextFunction } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../service/product.service';
import { protect } from '../models/auth';
import { productValidateTypes } from '../middleware/validators/productValidate';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  await getProducts(req, res, next);
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  await getProduct(req, res, next);
});

router.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req, res, next);
  },
  productValidateTypes.validateProduct,
  async (req: Request, res: Response, next: NextFunction) => {
    await createProduct(req, res, next);
  }
);

router.put(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req, res, next);
  },
  productValidateTypes.validateProduct,
  async (req: Request, res: Response, next: NextFunction) => {
    await updateProduct(req, res, next);
  }
);

router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req, res, next);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    await deleteProduct(req, res, next);
  }
);

export default router;
