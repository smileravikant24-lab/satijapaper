import { db, doc, getDoc } from './firebase.js';

export async function getConfigUrl(key) {
  const snap = await getDoc(doc(db, 'config', key));
  return snap.exists() ? snap.data().url : null;
}
