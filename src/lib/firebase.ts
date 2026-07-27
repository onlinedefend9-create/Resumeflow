import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "ungoogly-team-mdw77",
  appId: "1:127951030758:web:5c2cf897982d136cd8ae27",
  apiKey: "AIzaSyBnUv2JD67Y8mQ7jArvNbxU9M9CkPzNbUM",
  authDomain: "ungoogly-team-mdw77.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-cvcraft-ce4879bc-7d0b-4a47-b102-c553fae73cae",
  storageBucket: "ungoogly-team-mdw77.firebasestorage.app",
  messagingSenderId: "127951030758",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
