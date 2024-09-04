import serviceAccount from "../configs";
import * as admin from "firebase-admin";
import { Request } from "express";
import {Injectable, NestMiddleware, Response, Next} from "@nestjs/common";

Injectable()
export class FirebaseMiddleware implements NestMiddleware {
    private deliveryApp: any;

    constructor() {
        let authCredentials = {};
        Object.assign(authCredentials, serviceAccount);

        this.deliveryApp = admin.initializeApp({
            credential: admin.credential.cert(authCredentials)
        })
    }

    use(req: Request, @Response() res, @Next() next) {
        const token = req.headers.authorization;

        if (!token) {
            return this.accessDenied(req.url, res);
        }

        this.deliveryApp.auth().verifyIdToken(token.replace('Bearer ', ''))
            .then(async decodedToken => {

                next();
            })
            .catch((error) => {
                console.log('firebase error', error);
                return this.accessDenied(req.url, res);
            });
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