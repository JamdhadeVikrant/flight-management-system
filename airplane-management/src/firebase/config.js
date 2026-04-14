import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCkZFX_lGnU6CosogmO-oYrZTHMi8WEog4",
  authDomain: "pvg-154e3.firebaseapp.com",
  projectId: "pvg-154e3",
  storageBucket: "pvg-154e3.firebasestorage.app",
  messagingSenderId: "869641610104",
  appId: "1:869641610104:web:b7699443cc560f2dfd9e8d",
  measurementId: "G-25PEGZJNLJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const IS_DEMO = false;
export default app;
