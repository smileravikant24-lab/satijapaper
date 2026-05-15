// ============================================================
// USERS SERVICE - Firestore CRUD for the `users` collection
// ============================================================

import {
  db,
  doc, collection, getDocs, setDoc, deleteDoc
} from './firebase.js';

/** Fetch every user profile, sorted by name. */
export async function listUsers(){
  const snap  = await getDocs(collection(db, 'users'));
  const users = [];
  snap.forEach(d => users.push({id: d.id, ...d.data()}));
  users.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  return users;
}

/** Save (create or update) a user profile by doc id. */
export function saveUserProfile(docId, profile){
  return setDoc(doc(db, 'users', docId), profile, {merge: true});
}

/** Delete a user profile by doc id. */
export function deleteUserProfile(docId){
  return deleteDoc(doc(db, 'users', docId));
}
