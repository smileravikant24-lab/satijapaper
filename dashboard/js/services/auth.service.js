import {
  auth, db,
  signInWithEmailAndPassword, signOut, sendPasswordResetEmail, onAuthStateChanged,
  browserSessionPersistence, browserLocalPersistence, setPersistence,
  doc, getDoc, setDoc
} from './firebase.js';

import { DEFAULT_ADMIN_EMAIL } from '../config.js';


export const emailToId = email =>
email.toLowerCase().replace(/[^a-z0-9]/g, '_');
export const login = async (email, password) => {
  const persistence = email.toLowerCase() === 'pranavsatija@satijapaper.com'
    ? browserSessionPersistence
    : browserLocalPersistence;
  await setPersistence(auth, persistence);
  return signInWithEmailAndPassword(auth, email, password);
};
export const logout = () => signOut(auth);
export const resetPassword = email =>
sendPasswordResetEmail(auth, email);
export const onAuth = callback => onAuthStateChanged(auth, callback);
export const getIdToken = () => auth.currentUser?.getIdToken(true);
export async function fetchOrCreateProfile(fbUser){
  const emailId = emailToId(fbUser.email);
  const ref     = doc(db, 'users', emailId);
  const snap    = await getDoc(ref);

  if (snap.exists()){
    const d = snap.data();
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

  const isAdmin = fbUser.email.toLowerCase() === DEFAULT_ADMIN_EMAIL;
  const profile = {
    id:            emailId,
    email:         fbUser.email.toLowerCase(),
    uid:           fbUser.uid,
    name:          fbUser.email.split('@')[0],
    role:          isAdmin ? 'Admin' : 'Team Member',
    deptAccess:    isAdmin ? ['All'] : [],
    processAccess: [],
    linkAccess:    {}
  };
  await setDoc(ref, profile);
  return profile;
}
