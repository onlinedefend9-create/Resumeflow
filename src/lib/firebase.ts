import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

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

// Safe initialization of Firestore to handle sandbox / cross-origin iframe storage restrictions gracefully
let db: any;
try {
  const isIframe = typeof window !== 'undefined' && (window.self !== window.top || window.location.search.includes('iframe=true'));
  if (isIframe) {
    console.log("[Firebase] Iframe detected, initializing Firestore with long polling and standard memory cache.");
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    }, firebaseConfig.firestoreDatabaseId);
  } else {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
      experimentalForceLongPolling: true,
    }, firebaseConfig.firestoreDatabaseId);
  }
} catch (e) {
  console.warn("[Firebase] Failed to initialize Firestore with custom local cache (likely blocked inside sandboxed iframe), falling back to standard setup:", e);
  try {
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    }, firebaseConfig.firestoreDatabaseId);
  } catch (err2) {
    console.error("[Firebase] Standard initializeFirestore failed, falling back to basic getFirestore:", err2);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
}

export { app, auth, db };
