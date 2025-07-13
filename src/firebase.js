
// Replace the config below with your Firebase project's credentials
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDnyXZoM9n7mHmB3XSFMUbufpQ_aNfTTf0",
  authDomain: "stoneflowerhome-f57d7.firebaseapp.com",
  projectId: "stoneflowerhome-f57d7",
  storageBucket: "stoneflowerhome-f57d7.firebasestorage.app",
  messagingSenderId: "781095192113",
  appId: "1:781095192113:web:e0c691da0ac9b761603710",
  measurementId: "G-Z7N7PY2MLD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
