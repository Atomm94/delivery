// multer.middleware.ts
import * as multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { multerConfig } from '../configs'; // Adjust the path accordingly

export function multerMiddleware() {
  const upload = multer(multerConfig);

  return function (req: Request, res: Response, next: NextFunction) {
    upload.fields([
      { name: 'license' },
      { name: 'identity' },
      { name: 'trucks[0][vehicle_title][]', maxCount: 10 },
      { name: 'trucks[0][insurances][]', maxCount: 10 },
      { name: 'trucks[0][photos][]', maxCount: 10 },
    ])(req, res, (err: any) => {
      if (err) {
        return next(err);
      }
      next();
    });
  };
}
