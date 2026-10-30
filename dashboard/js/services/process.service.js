import { FUNCTION_URL } from '../config.js';
import { getIdToken }   from './auth.service.js';
import { LINK_META }    from '../data.js';

export async function resolveProcessUrl(procName, linkType){
  const idToken = await getIdToken();
  if (!idToken) return {ok: false, error: 'Please login again.'};

  async function queryCloud(key){
    try {
      const resp = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + idToken
        },
        body: JSON.stringify({procName, linkType: key})
      });
      const data = await resp.json();
      if (resp.ok && data.url) return {ok: true, url: data.url};
      return {ok: false, error: data.error || 'Link not available.'};
    } catch(err){
      return {ok: false, error: 'Network error.'};
    }
  }

  const primary = await queryCloud(linkType);
  if (primary.ok) return primary;

  // Fallback: If user saved the field with display label as key in Firebase (e.g. "Dis Appointment")
  const label = LINK_META[linkType]?.label;
  if (label && label !== linkType){
    const secondary = await queryCloud(label);
    if (secondary.ok) return secondary;
  }

  return primary;
}
