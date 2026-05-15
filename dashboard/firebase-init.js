/* ============================================================
   FIREBASE INITIALIZATION
   This file must load as an ES module (type="module").
   Exposes Firebase services on window for app.js to consume.
   ============================================================ */

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

const firebaseConfig = {
  apiKey: "AIzaSyBxt4HtZm03WQzQD7mMNOyIQr-KxAHBaO8",
  authDomain: "sp-dashboard-1e9c8.firebaseapp.com",
  projectId: "sp-dashboard-1e9c8",
  storageBucket: "sp-dashboard-1e9c8.firebasestorage.app",
  messagingSenderId: "347959572660",
  appId: "1:347959572660:web:72c16e7289d63bcaff3fe1"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// Expose to global so the non-module app.js can use them
window.fbAuth = auth;
window.fbDb   = db;
window.fbFns  = {
  signIn:    signInWithEmailAndPassword,
  signOut,
  onAuth:    onAuthStateChanged,
  resetPass: sendPasswordResetEmail,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs
};

// Tell app.js Firebase is ready
window.dispatchEvent(new Event('firebaseReady'));
