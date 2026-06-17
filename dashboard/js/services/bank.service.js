import { db, collection, getDocs } from './firebase.js';

let _cache = null;

export async function fetchBankDetails() {
  if (_cache) return _cache;
  const snap = await getDocs(collection(db, 'bank_details'));
  _cache = snap.docs.map(d => d.data()).sort((a, b) => a.order - b.order);
  return _cache;
}

export function getBankById(id) {
  return _cache?.find(b => b.id === id) || null;
}

export function clearBankCache() { _cache = null; }
