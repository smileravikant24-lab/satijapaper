import { $, showToast }                   from './ui/dom.js';
import { state }                           from './state.js';
import { onAuth, fetchOrCreateProfile }    from './services/auth.service.js';
import {
  handleLogin, handleLogout, forgotPass, togglePwd,
  showLoginScreen, showCheckingSession
}                                          from './ui/login.view.js';
import {
  updateCounts, filterCat, runFilter, paintSidebarUser
}                                          from './ui/sidebar.view.js';
import { renderFiltered, secureOpen }      from './ui/cards.view.js';
import { showAdmin }                       from './admin/admin.view.js';
import {
  openModal, closeModal, editUser, saveUser, deleteUserAct,
  onRoleChange, selectAllProcs
}                                          from './admin/modal.view.js';
import { PRODUCTS, DB }                    from './data.js';

// ─────────────────────────────────────────────────────────────
// STATE FLAGS
// daMode: 'hidden' → hide DA cards, show folder tile (Sales/All)
//         'only'   → show ONLY DA cards (Double A sidebar click)
//         'all'    → show all cards normally (other cats)
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// APP BOOT
// ─────────────────────────────────────────────────────────────
function enterApp(user) {
  state.curUser  = user;
  state.curGroup = null;
  state.daMode   = 'hidden';
  $('loginOverlay').classList.add('hidden');
  $('appContainer').classList.add('visible');
  paintSidebarUser(user);
  updateCounts();
  renderFiltered();
  _syncDoubleAFolder('All');
  _setProductsCount();
  _startCardObserver();
  _initMobileSidebar();   // ← mobile hamburger + backdrop
}

// ─────────────────────────────────────────────────────────────
// MOBILE SIDEBAR
// ─────────────────────────────────────────────────────────────
function _initMobileSidebar() {
  // Inject hamburger button into header-bar
  const headerBar = document.querySelector('.header-bar');
  if (headerBar && !document.getElementById('mobMenuBtn')) {
    const btn = document.createElement('button');
    btn.id        = 'mobMenuBtn';
    btn.className = 'mob-menu-btn';
    btn.title     = 'Menu';
    btn.innerHTML = '<i class="fas fa-bars"></i>';
    btn.addEventListener('click', _toggleSidebar);
    headerBar.insertBefore(btn, headerBar.firstChild);
  }
  // Inject backdrop
  if (!document.getElementById('sidebarBackdrop')) {
    const bd = document.createElement('div');
    bd.id        = 'sidebarBackdrop';
    bd.className = 'sidebar-backdrop';
    bd.addEventListener('click', _closeSidebar);
    document.body.appendChild(bd);
  }
  // Close sidebar on any nav click (mobile)
  document.querySelectorAll('.menu-btn').forEach(b =>
    b.addEventListener('click', () => { if (window.innerWidth <= 768) _closeSidebar(); })
  );
}

function _toggleSidebar() {
  document.getElementById('sidebar')?.classList.contains('sidebar-open')
    ? _closeSidebar() : _openSidebar();
}
function _openSidebar() {
  document.getElementById('sidebar')?.classList.add('sidebar-open');
  document.getElementById('sidebarBackdrop')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function _closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('sidebar-open');
  document.getElementById('sidebarBackdrop')?.classList.remove('open');
  document.body.style.overflow = '';
}

showCheckingSession();
onAuth(async fbUser => {
  if (!fbUser) { state.curUser = null; showLoginScreen(); return; }
  try {
    const profile = await fetchOrCreateProfile(fbUser);
    enterApp(profile);
  } catch (err) { console.error('Profile load failed:', err); showLoginScreen(); }
});

// ─────────────────────────────────────────────────────────────
// MUTATION OBSERVER
// Watches #cardBox. Every time cards are added (Firestore async
// render), applies DA visibility. This is reliable vs rAF.
// ─────────────────────────────────────────────────────────────
let _observer = null;

function _startCardObserver() {
  const grid = document.getElementById('cardBox');
  if (!grid || _observer) return;
  _observer = new MutationObserver(_applyDAVisibility);
  _observer.observe(grid, { childList: true });
}

// Set of DA process names for fast lookup
const _daNames = () => new Set(DB.filter(d => d.group === 'Double A').map(d => d.name));

function _applyDAVisibility() {
  const grid = document.getElementById('cardBox');
  if (!grid) return;

  const daNames = _daNames();

  if (state.daMode === 'hidden') {
    // Hide DA individual cards; inject folder tile
    grid.querySelectorAll('.card[data-name]').forEach(card => {
      card.style.display = daNames.has(card.dataset.name) ? 'none' : '';
    });
    if (!grid.querySelector('.da-folder-tile')) _injectDoubleAFolderTile(grid);

  } else if (state.daMode === 'only') {
    // Show ONLY DA cards; remove folder tile
    grid.querySelector('.da-folder-tile')?.remove();
    grid.querySelectorAll('.card[data-name]').forEach(card => {
      card.style.display = daNames.has(card.dataset.name) ? '' : 'none';
    });

  } else {
    // 'all' — show everything, no folder tile
    grid.querySelector('.da-folder-tile')?.remove();
    grid.querySelectorAll('.card[data-name]').forEach(card => {
      card.style.display = '';
    });
  }
}

// ─────────────────────────────────────────────────────────────
// DOUBLE A FOLDER TILE
// ─────────────────────────────────────────────────────────────

function _syncDoubleAFolder(activeCat) {
  const folder = document.getElementById('doubleAFolder');
  if (!folder) return;
  folder.style.display = (activeCat === 'Sales' || activeCat === 'All') ? 'block' : 'none';
  const badge = document.getElementById('cntDoubleA');
  if (badge) badge.textContent = DB.filter(p => p.group === 'Double A').length;
}

function _injectDoubleAFolderTile(grid) {
  if (!grid) grid = document.getElementById('cardBox');
  if (!grid || grid.querySelector('.da-folder-tile')) return;

  const daItems = DB.filter(d => d.group === 'Double A');
  if (!daItems.length) return;

  const listItems = daItems.map(d =>
    `<div class="da-folder-item"><i class="fas fa-file-lines"></i>${d.name}</div>`
  ).join('');

  const tile = document.createElement('div');
  tile.className    = 'da-folder-tile';
  tile.dataset.name = '__doubleA_folder__';  // not in DB so observer ignores it
  tile.innerHTML = `
    <div class="da-folder-icon-row">
      <span class="da-folder-icon"><i class="fas fa-folder-star"></i></span>
      <span class="da-folder-label">Double A</span>
      <span class="da-folder-count">${daItems.length}</span>
    </div>
    <div class="da-folder-desc">Container Booking · Distributor Checklist · CME Payment</div>
    <div class="da-folder-items">${listItems}</div>
    <div class="da-folder-footer"><i class="fas fa-arrow-right"></i> Click to open Double A processes</div>`;

  tile.addEventListener('click', () => filterGroup('Double A', document.getElementById('navDoubleA')));
  grid.appendChild(tile);
}

// ─────────────────────────────────────────────────────────────
// filterGroup — sidebar "Double A" click OR folder tile click
// ─────────────────────────────────────────────────────────────
function filterGroup(group, btn) {
  if (btn) {
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  _syncDoubleAFolder('Sales');
  _showCardGrid();

  state.curCat   = 'Sales';
  state.curGroup = group;
  state.daMode   = 'only';

  const header = document.getElementById('pageHeader');
  if (header) header.textContent = 'Double A — Sales';

  // Run original filter to load Sales cards from Firestore
  // Observer will then apply 'only' mode as cards arrive
  _origRunFilter();
}

// ─────────────────────────────────────────────────────────────
// PRODUCTS PAGE
// ─────────────────────────────────────────────────────────────
function _setProductsCount() {
  const badge = document.getElementById('cntProducts');
  if (badge) badge.textContent = PRODUCTS.length;
}

function showProducts(btn) {
  document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  state.curCat   = 'Products';
  state.curGroup = null;
  state.daMode   = 'all';

  document.getElementById('pageHeader').textContent   = 'Products';
  document.getElementById('searchWrap').style.display = 'none';
  document.getElementById('cardBox').style.display    = 'none';
  document.getElementById('adminPanel').style.display = 'none';

  const panel = document.getElementById('productsPanel');
  panel.style.display = 'block';
  panel.innerHTML     = _buildProductsHTML();
}

function _buildProductsHTML() {
  return `<div class="products-wrap">${PRODUCTS.map(_buildBrandCard).join('')}</div>`;
}

function _buildBrandCard(brand) {
  const certs    = brand.cert.map(c => `<span class="prod-cert">${c}</span>`).join('');
  const variants = brand.variants.map(v => _buildVariant(v, brand)).join('');
  const waMsg    = encodeURIComponent(brand.shareMsg || `Hi! I need ${brand.name} paper from Satija Paper. Please share pricing.`);
  const waUrl    = `https://wa.me/919899708098?text=${waMsg}`;
  return `
  <div class="prod-brand-card" id="prod-${brand.id}">
    <div class="prod-brand-header">
      <div class="prod-brand-img-wrap">
        <img src="${brand.img}" alt="${brand.name}" class="prod-brand-img"
             onerror="this.onerror=null;this.src='https://satijapaper.com/SP.jpg'">
      </div>
      <div class="prod-brand-meta">
        <h3 class="prod-brand-name">${brand.fullName || brand.name}</h3>
        <div class="prod-brand-origin"><i class="fas fa-location-dot"></i> ${brand.origin}</div>
        <p class="prod-brand-tagline">${brand.tagline}</p>
        <div class="prod-cert-row">${certs}</div>
      </div>
      <div class="prod-share-wrap">
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="prod-share-btn">
          <i class="fab fa-whatsapp"></i> Share
        </a>
      </div>
    </div>
    <div class="prod-variants-grid">${variants}</div>
  </div>`;
}

function _buildVariant(v, brand) {
  const sizes  = v.sizes.map(s => `<span class="prod-size-pill">${s}</span>`).join('');
  const imgSrc = v.img         || brand.img;
  const fbSrc  = v.fallbackImg || brand.img;
  const extras = [
    v.cie       ? `<div class="prod-spec"><span>CIE</span><strong>${v.cie}</strong></div>`             : '',
    v.opacity   ? `<div class="prod-spec"><span>Opacity</span><strong>${v.opacity}</strong></div>`     : '',
    v.thickness ? `<div class="prod-spec"><span>Thickness</span><strong>${v.thickness}</strong></div>` : '',
    v.sheets    ? `<div class="prod-spec"><span>Sheets/Ream</span><strong>${v.sheets}</strong></div>`  : '',
  ].filter(Boolean).join('');
  const waMsg = encodeURIComponent(`Hi! I need ${v.name} (${v.sizes.join('/')}) from Satija Paper. Please share pricing.`);
  const waUrl = `https://wa.me/919899708098?text=${waMsg}`;
  return `
  <div class="prod-variant-card">
    <div class="prod-variant-img-wrap">
      <img src="${imgSrc}" alt="${v.name}" class="prod-variant-img"
           onerror="this.onerror=null;this.src='${fbSrc}'">
    </div>
    <div class="prod-variant-info">
      <div class="prod-variant-name">${v.name}</div>
      <div class="prod-spec-row">
        <div class="prod-spec"><span>Brightness</span><strong>${v.brightness}</strong></div>
        ${extras}
      </div>
      <div class="prod-sizes-row">${sizes}</div>
      <div class="prod-bestfor"><i class="fas fa-circle-check"></i> ${v.bestFor}</div>
      <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="prod-variant-share">
        <i class="fab fa-whatsapp"></i> Share
      </a>
    </div>
  </div>`;
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function _showCardGrid() {
  document.getElementById('adminPanel').style.display    = 'none';
  document.getElementById('productsPanel').style.display = 'none';
  document.getElementById('searchWrap').style.display    = '';
  document.getElementById('cardBox').style.display       = '';
}

// ─────────────────────────────────────────────────────────────
// PATCHED filterCat & runFilter
// ─────────────────────────────────────────────────────────────
const _origFilterCat = filterCat;
const _origRunFilter = runFilter;

function filterCatPatched(cat, btn) {
  state.curGroup = null;
  state.daMode   = (cat === 'Sales' || cat === 'All') ? 'hidden' : 'all';
  _origFilterCat(cat, btn);
  _syncDoubleAFolder(cat);
  _showCardGrid();
  // observer fires automatically when renderFiltered() populates #cardBox
}

function runFilterPatched() {
  _origRunFilter();
  // observer handles DA visibility as cards land in DOM
}

// ─────────────────────────────────────────────────────────────
// EXPOSE TO WINDOW
// ─────────────────────────────────────────────────────────────
Object.assign(window, {
  handleLogin, handleLogout, forgotPass, togglePwd,
  filterCat:   filterCatPatched,
  runFilter:   runFilterPatched,
  filterGroup,
  showProducts,
  secureOpen,
  showAdmin,
  openModal, closeModal, editUser, saveUser, deleteUserAct,
  onRoleChange, selectAllProcs,
  toggleSidebar: _toggleSidebar,
});
