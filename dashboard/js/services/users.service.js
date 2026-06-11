import {
  db,
  doc, collection, getDocs, setDoc, deleteDoc
} from './firebase.js';

export async function listUsers(){
  const snap  = await getDocs(collection(db, 'users'));
  const users = [];
  snap.forEach(d => users.push({id: d.id, ...d.data()}));
  users.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  return users;
}

export function saveUserProfile(docId, profile){
  return setDoc(doc(db, 'users', docId), profile);
}

export function deleteUserProfile(docId){
  return deleteDoc(doc(db, 'users', docId));
}
