// ============================================================
// DOM HELPERS + TOAST
// ============================================================

import { TOAST_DURATION_MS } from '../config.js';

/** Shorthand for document.getElementById. */
export const $ = id => document.getElementById(id);

/** Escape a string for safe insertion into HTML attribute / text. */
export const escapeHtml = str =>
  String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

let _toastTimer;

/**
 * Show a transient toast notification.
 * @param {string} msg
 * @param {'ok'|'err'|'info'} type
 */
export function showToast(msg, type = 'info'){
  const t = $('toast');
  if (!t) return;
  t.textContent = msg;
  t.className   = `toast ${type} show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(()=> { t.className = 'toast'; }, TOAST_DURATION_MS);
}
