import { FUNCTION_URL } from '../config.js';
import { getIdToken }   from './auth.service.js';
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
