import { db, collection, getDocs } from './firebase.js';

let _cache = null;

export async function fetchGodownList() {
  if (_cache) return _cache;
  const snap = await getDocs(collection(db, 'godown_addresses'));
  _cache = snap.docs.map(d => d.data()).sort((a, b) => (a.order || 0) - (b.order || 0));
  return _cache;
}

export function getGodownList() { return _cache || []; }
export function clearGodownCache() { _cache = null; }
