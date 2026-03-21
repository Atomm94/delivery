import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { multerMiddleware } from '../middlewares/multer.middleware';

@Injectable()
export class FilesInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    // Prevent double execution when interceptor is applied both globally and per-route
    if ((req as any).__filesInterceptorRan) {
      return next.handle();
    }

    // Helper: detect multipart/form-data
    const isMultipart = () => {
      const ct = (req.headers['content-type'] || '').toString();
      return ct.startsWith('multipart/form-data');
    };

    const runNext = (observer, normalize: boolean) => {
      try {
        if (normalize) {
          this.normalizeRequestBody(req);
        }
      } catch {
        // swallow normalization errors
      }

      (req as any).__filesInterceptorRan = true;
      next.handle().subscribe({
        next: (result) => {
          observer.next(result);
          observer.complete();
        },
        error: (err) => observer.error(err),
      });
    };

    return new Observable((observer) => {
      // Only invoke multer for multipart requests; otherwise just normalize plain bodies
      if (isMultipart()) {
        multerMiddleware()(req, res, (err) => {
          if (err) {
            observer.error(err);
          } else {
            runNext(observer, true);
          }
        });
      } else {
        runNext(observer, true);
      }
    });
  }

  // Convert bracketed keys in req.body to nested objects/arrays and prune raw keys
  private normalizeRequestBody(req: Request) {
    const src: Record<string, any> = { ...(req.body || {}) };
    const dest: Record<string, any> = {};

    const parseKey = (key: string): (string | number)[] => {
      const parts: (string | number)[] = [];
      const base = key.split('[')[0];
      parts.push(base);
      const brackets = key.match(/\[[^\]]*\]/g);
      if (brackets) {
        brackets.forEach((b) => {
          const inner = b.substring(1, b.length - 1);
          if (inner === '') {
            // push token ("[]") — we'll convert to next numeric index at assignment time using -1 sentinel
            parts.push(-1);
          } else if (/^\d+$/.test(inner)) {
            parts.push(Number(inner));
          } else {
            parts.push(inner);
          }
        });
      }
      return parts;
    };

    const setDeep = (obj: any, path: (string | number)[], value: any) => {
      let curr = obj;
      for (let i = 0; i < path.length; i++) {
        const key = path[i];
        const isLast = i === path.length - 1;
        const nextKey = path[i + 1];

        // Determine container type needed for next step
        const needArray = typeof nextKey === 'number';

        if (typeof key === 'number') {
          // current is array index
          if (!Array.isArray(curr)) {
            // Replace non-array with array
            curr = [];
          }
          const index = key === -1 ? curr.length : key;
          if (isLast) {
            curr[index] = value;
            return;
          }
          if (curr[index] == null) {
            curr[index] = needArray ? [] : {};
          }
          curr = curr[index];
        } else {
          // key is string property
          if (isLast) {
            if (key in curr && typeof curr[key] === 'object' && curr[key] !== null && typeof value === 'object' && value !== null) {
              // shallow merge objects
              curr[key] = { ...curr[key], ...value };
            } else {
              curr[key] = value;
            }
            return;
          }
          if (!(key in curr) || curr[key] == null) {
            curr[key] = needArray ? [] : {};
          }
          curr = curr[key];
        }
      }
    };

    // First pass: handle bracketed keys and prune them
    Object.keys(src).forEach((key) => {
      if (key.includes('[') && key.includes(']')) {
        const path = parseKey(key);
        setDeep(dest, path, src[key]);
      }
    });

    // Second pass: copy non-bracket keys that were not set by bracket parser
    Object.keys(src).forEach((key) => {
      if (!(key.includes('[') && key.includes(']'))) {
        // If key already set by bracket parsing, keep existing
        if (!(key in dest)) {
          let val: any = src[key];
          // Attempt to JSON.parse simple object/array strings
          if (typeof val === 'string' && (val.trim().startsWith('{') || val.trim().startsWith('['))) {
            try {
              val = JSON.parse(val);
            } catch {
              // leave as string
            }
          }
          dest[key] = val;
        }
      }
    });

    // Replace original body
    (req as any).body = dest;
  }
}
