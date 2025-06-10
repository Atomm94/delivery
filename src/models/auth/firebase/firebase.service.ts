import serviceAccount from '../configs';
import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  constructor() {
    let authCredentials = {};
    Object.assign(authCredentials, serviceAccount);

    admin.initializeApp({
      credential: admin.credential.cert(authCredentials)
    })
  }

  public async auth(token: string) {
    return admin.auth().verifyIdToken(token.replace('Bearer ', ''))
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