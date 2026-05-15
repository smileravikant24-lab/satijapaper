// ============================================================
// SIDEBAR VIEW - counts, active highlight, navigation
// ============================================================

import { $ }              from './dom.js';
import { state }          from '../state.js';
import { DB, NAV_TABS }   from '../data.js';
import { canAccessProc }  from './access.js';
import { renderFiltered } from './cards.view.js';

/**
 * Recompute per-category counts based on current user
 * and update the sidebar badges + visibility.
 */
export function updateCounts(){
  const isAdmin = state.curUser?.role === 'Admin';

  const counts = {
    All:0, Sales:0, Purchase:0, Management:0,
    HR:0, Finance:0, Support:0, 'My System':0, Family:0
  };

  DB.forEach(d => {
    if (canAccessProc(state.curUser, d)){
      counts.All++;
      if (counts[d.cat] !== undefined) counts[d.cat]++;
    }
  });

  NAV_TABS.forEach(tab => {
    const btn = $(tab.nav);
    if (!btn) return;
    const n   = counts[tab.cat] ?? 0;
    const cnt = $(tab.cnt);
    if (cnt) cnt.textContent = n;

    let visible;
    if (tab.cat === 'All'){
      const activeDepts = ['Sales','Purchase','Management','HR','Finance','Support','My System']
        .filter(c => (counts[c] ?? 0) > 0);
      visible = isAdmin || activeDepts.length >= 2;
    } else if (tab.cat === 'Family'){
      visible = n > 0;
    } else {
      visible = isAdmin || n > 0;
    }
    btn.style.display = visible ? '' : 'none';
  });

  // Admin section
  $('adminNavLabel').style.display = isAdmin ? '' : 'none';
  $('adminNavBtn').style.display   = isAdmin ? '' : 'none';
}

/** Mark a single sidebar button as active. */
export function setActive(el){
  document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
}

/** Switch the visible category and re-render cards. */
export function filterCat(cat, el){
  state.curCat = cat;
  setActive(el);
  $('pageHeader').innerText      = cat === 'All' ? 'All Processes' : cat;
  $('cardBox').style.display     = '';
  $('adminPanel').classList.remove('visible');
  $('searchWrap').style.display  = '';
  renderFiltered();
}

/** Re-render based on current search + category. */
export function runFilter(){
  renderFiltered();
}

/** Populate the bottom-of-sidebar user widget. */
export function paintSidebarUser(user){
  $('sAvatar').textContent = (user.name || 'U').charAt(0).toUpperCase();
  $('sName').textContent   = user.name;
  $('sRole').textContent   = user.role;
}
