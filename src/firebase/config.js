import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAawKgOdD90ip5cWBExrE1RLBm_K5GZLk0",
  authDomain: "farmacia-farmagen.firebaseapp.com",
  projectId: "farmacia-farmagen",
  storageBucket: "farmacia-farmagen.firebasestorage.app",
  messagingSenderId: "812270630606",
  appId: "1:812270630606:web:33581a5e9dbda3f32f829f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
