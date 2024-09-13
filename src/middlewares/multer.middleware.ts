import * as multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { multerConfig } from '../configs';
import { FieldConfig } from '../common/interfaces/common.interface';

export function multerMiddleware(fields: FieldConfig[]) {
  const upload = multer(multerConfig);

  return function (req: Request, res: Response, next: NextFunction) {
    upload.fields(fields)(req, res, (err: any) => {
      if (err) {
        return next(err);
      }
      next();
    });
  };
}
