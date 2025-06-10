import { FirebaseService } from './firebase.service';

const firebaseService = new FirebaseService()

export default async (token: string, title: string, body: string) => {
  return await firebaseService.sendPushNotification(token, title, body);
}

// async notifyUser(fcmToken: string) {
//   return await this.firebaseService.sendPushNotification(
//     fcmToken,
//     'You have a new message!',
//     'Click here to read it.'
//   );
// }