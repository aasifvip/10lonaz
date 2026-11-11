import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";

// Firebase Configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = (): boolean =>
  Object.values(firebaseConfig).every((value) => Boolean(value));

const configuredApp = isFirebaseConfigured()
  ? getApps().find((app) => app.name === "[DEFAULT]") ?? initializeApp(firebaseConfig)
  : null;

export const firebaseApp: FirebaseApp | null = configuredApp;
export const db: Firestore | null = configuredApp ? getFirestore(configuredApp) : null;
export const storage: FirebaseStorage | null = configuredApp ? getStorage(configuredApp) : null;
