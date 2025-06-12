import * as admin from 'firebase-admin';
import serviceAccount from '../configs'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
  console.log('✅ Firebase initialized');
}

export { admin };
