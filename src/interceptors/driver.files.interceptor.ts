import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { multerMiddleware } from '../middlewares/multer.middleware';

@Injectable()
export class DriverFilesInterceptor implements NestInterceptor {

  private readonly fields = [
    { name: 'license' },
    { name: 'identity' },
  ];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    return new Observable((observer) => {
      multerMiddleware(this.fields)(req, res, (err) => {
        if (err) {
          observer.error(err);
        } else {
          next.handle().subscribe({
            next: (result) => {
              observer.next(result);
              observer.complete();
            },
            error: (err) => observer.error(err),
          });
        }
      });
    });
  }
}
