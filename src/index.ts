import express, { Request, Response, NextFunction } from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { errorHandler } from './middleware/error/errorHandler';
import config from './config';
dotenv.config();

export const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //allows query parameters, lo pasa a un object

app.use('/api', router);

router.use(
  (
    data: { error: Error; deafultMessage?: string },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    errorHandler(data.error, res, data.deafultMessage);
  }
);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.config}`);
});
