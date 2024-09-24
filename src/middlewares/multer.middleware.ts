import * as multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { multerConfig } from '../configs';

export function multerMiddleware() {
  const upload = multer(multerConfig);

  return function (req: Request, res: Response, next: NextFunction) {
    upload.any()(req, res, (err: any) => {
      if (err) {
        return next(err);
      }
      next();
    });
  };
}
