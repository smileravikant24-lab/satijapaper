// ============================================================
// APPLICATION CONFIG
// ============================================================
// All environment-specific values live here. Change once, used everywhere.

export const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBxt4HtZm03WQzQD7mMNOyIQr-KxAHBaO8",
  authDomain:        "sp-dashboard-1e9c8.firebaseapp.com",
  projectId:         "sp-dashboard-1e9c8",
  storageBucket:     "sp-dashboard-1e9c8.firebasestorage.app",
  messagingSenderId: "347959572660",
  appId:             "1:347959572660:web:72c16e7289d63bcaff3fe1"
};

// Cloud Function that returns the actual URL for a process+linkType
export const FUNCTION_URL =
  'https://asia-south1-sp-dashboard-1e9c8.cloudfunctions.net/getProcessUrl';

// Email that becomes Admin by default on first sign-in
export const DEFAULT_ADMIN_EMAIL = 'mis@satijapaper.com';

// Toast auto-dismiss delay
export const TOAST_DURATION_MS = 3200;
