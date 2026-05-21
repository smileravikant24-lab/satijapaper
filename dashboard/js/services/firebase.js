
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { FIREBASE_CONFIG } from '../config.js';

const app = initializeApp(FIREBASE_CONFIG);

/** Firebase Auth instance. */
export const auth = getAuth(app);

/** Firestore database instance. */
export const db = getFirestore(app);

// Auth fns
export {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
};

// Firestore fns
export { doc, getDoc, setDoc, deleteDoc, collection, getDocs };
