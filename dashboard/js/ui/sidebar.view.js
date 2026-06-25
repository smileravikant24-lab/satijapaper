import { $ }              from './dom.js';
import { state }          from '../state.js';
import { DB, NAV_TABS, PRODUCTS }   from '../data.js';
import { canAccessProc }  from './access.js';
import { renderFiltered } from './cards.view.js';

export function updateCounts(){
  const isAdmin = state.curUser?.role === 'Admin';

  const counts = {
    All:0, Import:0, Sales:0, Warehouse:0, Purchase:0,
    Accounts:0, AdminMIS:0, Support:0, Family:0
  };

  DB.forEach(d => {
    if (d.navTo) return; // skip nav shortcut items
    if (canAccessProc(state.curUser, d)){
      counts.All++;
      const key = d.cat === 'Documents' ? 'Family' : d.cat;
      if (counts[key] !== undefined) counts[key]++;
    }
  });

  NAV_TABS.forEach(tab => {
    const btn = $(tab.nav);
    if (!btn) return;

    let visible;
    const hasAllAccess = state.curUser?.deptAccess?.includes('All');
    const cnt = $(tab.cnt);

    if (tab.cat === 'Products' || tab.cat === 'Bank Details') {
      visible = isAdmin || hasAllAccess || state.curUser?.deptAccess?.includes(tab.cat);
      if (cnt) {
        if (tab.cat === 'Products' && typeof PRODUCTS !== 'undefined') {
          cnt.textContent = PRODUCTS.length;
        } else if (cnt) {
          cnt.style.display = 'none';
        }
      }
    } else if (tab.cat === 'Family') {
      const n = counts['Family'] ?? 0;
      if (cnt) cnt.textContent = n;
      visible = isAdmin || n > 0;
    } else {
      const n = counts[tab.cat] ?? 0;
      if (cnt) cnt.textContent = n;
      if (tab.cat === 'All'){
        const activeDepts = ['Import','Sales','Warehouse','Purchase','Accounts','AdminMIS','Support'].filter(c => (counts[c] ?? 0) > 0);
        visible = isAdmin || activeDepts.length >= 2;
      } else {
        visible = isAdmin || n > 0;
      }
    }
    btn.style.display = visible ? '' : 'none';
  });

  $('adminNavLabel').style.display = isAdmin ? '' : 'none';
  $('adminNavBtn').style.display   = isAdmin ? '' : 'none';
}

export function setActive(el){
  document.querySelectorAll('.tab-btn,.menu-btn').forEach(b => b.classList.remove('active'));
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
