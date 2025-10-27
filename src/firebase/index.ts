import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import { useUser } from './auth/use-user';
import {
  FirebaseProvider,
  FirebaseClientProvider,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
} from './provider';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;

function initializeFirebase() {
  if (typeof window !== 'undefined') {
    if (!app) {
      const apps = getApps();
      if (apps.length > 0) {
        app = apps[0];
      } else {
        app = initializeApp(firebaseConfig);
      }
      auth = getAuth(app);
      firestore = getFirestore(app);
    }
  }
  return { app, auth, firestore };
}

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useCollection,
  useDoc,
  useUser,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
};
