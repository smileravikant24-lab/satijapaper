// ============================================================
// PROCESS SERVICE
// Calls the secure Cloud Function that returns the real URL
// for a given process + link type. Front-end never sees the URLs.
// ============================================================

import { FUNCTION_URL } from '../config.js';
import { getIdToken }   from './auth.service.js';

/**
 * Resolve a process + link type into a URL the user can open.
 * @param {string} procName
 * @param {string} linkType
 * @returns {Promise<{ok:boolean, url?:string, error?:string}>}
 */
export async function resolveProcessUrl(procName, linkType){
  const idToken = await getIdToken();
  if (!idToken) return {ok: false, error: 'Please login again.'};

  try {
    const resp = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + idToken
      },
      body: JSON.stringify({procName, linkType})
    });
    const data = await resp.json();
    if (resp.ok && data.url) return {ok: true, url: data.url};
    return {ok: false, error: data.error || 'Link not available.'};
  } catch(err){
    return {ok: false, error: 'Network error.'};
  }
}
