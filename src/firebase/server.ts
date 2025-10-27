// This file is for server-side Firebase initialization
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';

// IMPORTANT: Replace with your service account key file path
// You can download this from your Firebase project settings
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

let app;
if (serviceAccount) {
  app =
    getApps().length > 0
      ? getApp()
      : initializeApp({
          credential: cert(serviceAccount),
          databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
        });
} else {
    console.warn('Firebase service account key not found. Server-side Firebase features will be disabled.');
}


const db = app ? getFirestore(app) : undefined;

export { db };
