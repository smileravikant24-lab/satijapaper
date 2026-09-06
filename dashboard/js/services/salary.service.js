import { db, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } from './firebase.js';

const COL = 'salary_disbursements';

export function getSalaryMonthInfo() {
  const now = new Date();
  let y = now.getFullYear(), m = now.getMonth();
  if (now.getDate() <= 15) { m -= 1; if (m < 0) { m = 11; y -= 1; } }
  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const pad = n => String(n).padStart(2, '0');
  return {
    label:   `${MONTHS[m]} ${y}`,
    cashId:  `${y}_${pad(m + 1)}_cash`,
    bankId:  `${y}_${pad(m + 1)}_bank`,
  };
}

export async function getSalaryDoc(docId) {
  const snap = await getDoc(doc(db, COL, docId));
  return snap.exists() ? snap.data() : null;
}

export async function saveSalaryDoc(docId, data) {
  await setDoc(doc(db, COL, docId), data, { merge: true });
}

export async function updateSalaryField(docId, fieldPath, value) {
  const ref = doc(db, COL, docId);
  await updateDoc(ref, { [fieldPath]: value });
}

export async function updateSalaryEntryField(docId, entryId, field, value) {
  await updateSalaryField(docId, `entries.${entryId}.${field}`, value);
}

export async function deleteSalaryDoc(docId) {
  await deleteDoc(doc(db, COL, docId));
}
