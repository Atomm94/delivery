import { Request } from "express";
import {Injectable, NestMiddleware, Response, Next} from "@nestjs/common";
import { FirebaseService } from './firebase.service';

Injectable()
export class FirebaseMiddleware implements NestMiddleware {
    constructor(
      private readonly firebaseService: FirebaseService,
    ) {}

    async use(req: Request, @Response() res, @Next() next) {
        const token = req.headers.authorization;

        if (!token) {
            return this.accessDenied(req.url, res);
        }

        const decodedToken = await this.firebaseService.auth(token)

        if (!decodedToken) {
            return this.accessDenied(req.url, res);
        }

        next()
    }

    private accessDenied(url: string, @Response() res) {
        res.status(403).json({
            statusCode: 403,
            timestamp: new Date().toISOString(),
            path: url,
            message: 'Access denied',
        })
    }
}