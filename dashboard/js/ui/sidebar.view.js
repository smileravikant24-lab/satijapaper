import { $ }              from './dom.js';
import { state }          from '../state.js';
import { DB, NAV_TABS }   from '../data.js';
import { canAccessProc }  from './access.js';
import { renderFiltered } from './cards.view.js';

export function updateCounts(){
  const isAdmin = state.curUser?.role === 'Admin';

  const counts = {
    All:0, Sales:0, Dispatch:0, Purchase:0, Management:0,
    HR:0, Finance:0, Support:0, 'My System':0, Documents:0, Family:0
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

    let n = counts[tab.cat] ?? 0;
    if (tab.cat === 'Documents') {
      n += counts['Family'] ?? 0;
    }

    const cnt = $(tab.cnt);
    if (cnt) cnt.textContent = n;

    let visible;
    if (tab.cat === 'All'){
      const activeDepts = ['Sales','Dispatch','Purchase','Management','HR','Finance','Support','My System']
        .filter(c => (counts[c] ?? 0) > 0);
      visible = isAdmin || activeDepts.length >= 2;
    } else if (tab.cat === 'Documents' || tab.cat === 'Family'){
      visible = n > 0;
    } else {
      visible = isAdmin || n > 0;
    }
    btn.style.display = visible ? '' : 'none';
  });

  $('adminNavLabel').style.display = isAdmin ? '' : 'none';
  $('adminNavBtn').style.display   = isAdmin ? '' : 'none';
}

export function setActive(el){
  document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
}

export function filterCat(cat, el){
  state.curCat = cat;
  setActive(el);
  $('pageHeader').innerText      = cat === 'All' ? 'All Processes' : cat;
  $('cardBox').style.display     = '';
  $('adminPanel').classList.remove('visible');
  $('searchWrap').style.display  = '';
  renderFiltered();
}

export function runFilter(){
  renderFiltered();
}

export function paintSidebarUser(user){
  $('sAvatar').textContent = (user.name || 'U').charAt(0).toUpperCase();
  $('sName').textContent   = user.name;
  $('sRole').textContent   = user.role;
}
