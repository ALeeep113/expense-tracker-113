// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1ul9ovaZscxQy-bPa6_7uiquwl0JGFhc",
  authDomain: "catatan-keuangan-113.firebaseapp.com",
  projectId: "catatan-keuangan-113",
  storageBucket: "catatan-keuangan-113.firebasestorage.com",
  messagingSenderId: "672233321902",
  appId: "1:672233321902:web:84845d0b4256f9ea1a443f",
  measurementId: "G-0FFYLEHBM4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
