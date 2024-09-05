import {Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Response} from "express";
import * as jwt from 'jsonwebtoken';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers['authorization'];

            if (!token) {
                return this.accessDenied(req.url, res);
            }

            const decodedToken = await jwt.verify(token.replace('Bearer ', ''), this.configService.get('JWT_SECRET_KEY'));

            req['user'] = {
                phone_number: decodedToken['phone_number'],
                role: decodedToken['role'],
            };

            next();
        }catch (error) {
            return this.accessDenied(req.url, res);
        }
    }

    private accessDenied(url: string, res: Response) {
        res.status(403).json({
            statusCode: 403,
            timestamp: new Date().toISOString(),
            path: url,
            message: 'Access denied',
        })
    }
}