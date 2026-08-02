import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

export const firebaseConfig = {
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || "ungoogly-team-mdw77",
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || "1:127951030758:web:5c2cf897982d136cd8ae27",
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "AIzaSyBnUv2JD67Y8mQ7jArvNbxU9M9CkPzNbUM",
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || "ungoogly-team-mdw77.firebaseapp.com",
  firestoreDatabaseId: (import.meta as any).env?.VITE_FIREBASE_DATABASE_ID || "ai-studio-cvcraft-ce4879bc-7d0b-4a47-b102-c553fae73cae",
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || "ungoogly-team-mdw77.firebasestorage.app",
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "127951030758",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

export { app, auth, db };
