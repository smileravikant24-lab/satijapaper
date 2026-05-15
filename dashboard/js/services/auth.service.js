// ============================================================
// AUTH SERVICE
// Login / logout / password reset + profile bootstrap on Firestore.
// ============================================================

import {
  auth, db,
  signInWithEmailAndPassword, signOut, sendPasswordResetEmail, onAuthStateChanged,
  doc, getDoc, setDoc
} from './firebase.js';

import { DEFAULT_ADMIN_EMAIL } from '../config.js';

/** Convert an email to a Firestore-safe doc ID. */
export const emailToId = email =>
  email.toLowerCase().replace(/[^a-z0-9]/g, '_');

/** Sign in with email+password. Throws on failure. */
export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

/** Sign out the current user. */
export const logout = () => signOut(auth);

/** Trigger a password-reset email. */
export const resetPassword = email =>
  sendPasswordResetEmail(auth, email);

/** Subscribe to auth state changes. */
export const onAuth = callback => onAuthStateChanged(auth, callback);

/** Get a fresh ID token for the currently signed-in Firebase user. */
export const getIdToken = () => auth.currentUser?.getIdToken(true);

/**
 * Fetch the user profile from Firestore.
 * If no profile exists, create a bare-bones one
 * (Admin if email matches DEFAULT_ADMIN_EMAIL, else Team Member).
 */
export async function fetchOrCreateProfile(fbUser){
  const emailId = emailToId(fbUser.email);
  const ref     = doc(db, 'users', emailId);
  const snap    = await getDoc(ref);

  if (snap.exists()){
    const d = snap.data();

    // Backfill uid if missing (older profiles)
    if (!d.uid){
      try { await setDoc(ref, {uid: fbUser.uid}, {merge: true}); }
      catch(_){ /* non-fatal */ }
    }

    return {
      id:            emailId,
      uid:           fbUser.uid,
      email:         fbUser.email,
      name:          d.name           || fbUser.email.split('@')[0],
      role:          d.role           || 'Team Member',
      deptAccess:    Array.isArray(d.deptAccess)    ? d.deptAccess    : [],
      processAccess: Array.isArray(d.processAccess) ? d.processAccess : [],
      linkAccess:    (d.linkAccess && typeof d.linkAccess === 'object') ? d.linkAccess : {}
    };
  }

  // Brand-new profile
  const isAdmin = fbUser.email.toLowerCase() === DEFAULT_ADMIN_EMAIL;
  const profile = {
    id:            emailId,
    email:         fbUser.email.toLowerCase(),
    uid:           fbUser.uid,
    name:          fbUser.email.split('@')[0],
    role:          isAdmin ? 'Admin' : 'Team Member',
    deptAccess:    isAdmin ? ['All'] : [],
    processAccess: []
  };
  await setDoc(ref, profile);
  return profile;
}
