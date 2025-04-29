// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Config Firebase de ton projet (récupère cette info sur la console Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyB-OpI-2nshDe3jXn3ibveuh2itYxVDi4k",
  authDomain: "runit-151b1.firebaseapp.com",
  projectId: "runit-151b1",
  storageBucket: "runit-151b1.firebasestorage.app",
  messagingSenderId: "248311114644",
  appId: "1:248311114644:web:ffa1468efa512dfae3bd81",
  measurementId: "G-FCEHB2P98H"
};

const app = initializeApp(firebaseConfig);

// Exporter l'authentification, firestore et storage
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);