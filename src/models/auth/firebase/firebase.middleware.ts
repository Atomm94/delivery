import { Request } from 'express';
import {Injectable, NestMiddleware, Response, Next} from "@nestjs/common";
import { admin } from './firebase.admin';

Injectable()
export class FirebaseMiddleware implements NestMiddleware {
    constructor() {}

    async use(req: Request, @Response() res, @Next() next) {
       // const token = req.headers.authorization;

        const token = req.headers.authorization?.replace('Bearer ', '').trim();

        console.log('sfdfdf');
        console.log(token);

        if (!token) {
            return this.accessDenied(req.url, res);
        }

        const decodedToken = await admin.auth().verifyIdToken(token)

        console.log('daadadad ok ok ok');
        console.log(decodedToken);

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

    public async sendPushNotification(token: string, title: string, body: string) {
        const message = {
            notification: {
                title,
                body,
            },
            token,
        };

        try {
            const response = await admin.messaging().send(message);
            console.log('Successfully sent message:', response);
            return response;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
}