import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBK3JxyeD6BnUp7I7blqAq3yxSmdjlgj1U",
  authDomain: "gen-z-blogs.firebaseapp.com",
  projectId: "gen-z-blogs",
  storageBucket: "gen-z-blogs.firebasestorage.app",
  messagingSenderId: "520407157343",
  appId: "1:520407157343:web:2c1c3b81c74ea9608169ea"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
