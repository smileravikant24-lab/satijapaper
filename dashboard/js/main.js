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
// APP BOOT
// ─────────────────────────────────────────────────────────────
function enterApp(user) {
  state.curUser     = user;
  state.curGroup    = null;
  state.daMode      = 'hidden'; // 'hidden' | 'only'
  $('loginOverlay').classList.add('hidden');
  $('appContainer').classList.add('visible');
  paintSidebarUser(user);
  updateCounts();
  renderFiltered();
  _syncDoubleAFolder('All');
  _setProductsCount();
  _startCardObserver();   // watch card grid for DA cards at all times
}

showCheckingSession();

onAuth(async fbUser => {
  if (!fbUser) { state.curUser = null; showLoginScreen(); return; }
  try {
    const profile = await fetchOrCreateProfile(fbUser);
    enterApp(profile);
  } catch (err) {
    console.error('Profile load failed:', err);
    showLoginScreen();
  }
});

// ─────────────────────────────────────────────────────────────
// MUTATION OBSERVER — watches cardBox, applies DA visibility
// whenever cards are added/changed (handles async Firestore render)
// ─────────────────────────────────────────────────────────────
let _observer = null;

function _startCardObserver() {
  const grid = document.getElementById('cardBox');
  if (!grid || _observer) return;

  _observer = new MutationObserver(() => _applyDAVisibility());
  _observer.observe(grid, { childList: true, subtree: false });
}

/**
 * Core visibility logic — called by observer whenever grid changes.
 * daMode === 'hidden' → hide DA cards, show folder tile
 * daMode === 'only'   → show ONLY DA cards, no folder tile
 * daMode === 'all'    → show everything (other categories)
 */
function _applyDAVisibility() {
  const grid = document.getElementById('cardBox');
  if (!grid) return;

  // Find DA card names
  const daNames = new Set(DB.filter(d => d.group === 'Double A').map(d => d.name));

  if (state.daMode === 'hidden') {
    // Hide DA individual cards
    grid.querySelectorAll('[data-name]').forEach(card => {
      if (card.classList.contains('da-folder-tile')) return;
      card.style.display = daNames.has(card.dataset.name) ? 'none' : '';
    });
    // Ensure folder tile exists
    if (!grid.querySelector('.da-folder-tile')) _injectDoubleAFolderTile(grid);

  } else if (state.daMode === 'only') {
    // Show only DA cards, hide everything else incl folder tile
    grid.querySelectorAll('[data-name]').forEach(card => {
      if (card.classList.contains('da-folder-tile')) {
        card.style.display = 'none'; return;
      }
      card.style.display = daNames.has(card.dataset.name) ? '' : 'none';
    });
    // Remove folder tile
    grid.querySelector('.da-folder-tile')?.remove();

  } else {
    // 'all' — show everything, remove folder tile
    grid.querySelectorAll('[data-name]').forEach(card => {
      card.style.display = '';
    });
    grid.querySelector('.da-folder-tile')?.remove();
  }
}

// ─────────────────────────────────────────────────────────────
// DOUBLE A FOLDER TILE — injected into card grid
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
  if (!grid) return;
  if (grid.querySelector('.da-folder-tile')) return; // already exists

  const daItems  = DB.filter(d => d.group === 'Double A');
  if (!daItems.length) return;

  const listItems = daItems.map(d =>
    `<div class="da-folder-item"><i class="fas fa-file-lines"></i>${d.name}</div>`
  ).join('');

  const tile = document.createElement('div');
  tile.className    = 'da-folder-tile';
  tile.dataset.name = '__doubleA_folder__';
  tile.innerHTML = `
    <div class="da-folder-icon-row">
      <span class="da-folder-icon"><i class="fas fa-folder-star"></i></span>
      <span class="da-folder-label">Double A</span>
      <span class="da-folder-count">${daItems.length}</span>
    </div>
    <div class="da-folder-desc">Container Booking · Distributor Checklist · CME Payment</div>
    <div class="da-folder-items">${listItems}</div>
    <div class="da-folder-footer"><i class="fas fa-arrow-right"></i> Click to open Double A processes</div>`;

  tile.addEventListener('click', () => {
    const navDA = document.getElementById('navDoubleA');
    if (navDA) filterGroup('Double A', navDA);
  });

  grid.appendChild(tile);
}

// ─────────────────────────────────────────────────────────────
// filterGroup — sidebar "Double A" click
// ─────────────────────────────────────────────────────────────

function filterGroup(group, btn) {
  document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _syncDoubleAFolder('Sales');
  _showCardGrid();

  state.curCat   = 'Sales';
  state.curGroup = group;
  state.daMode   = 'only';    // show ONLY DA cards

  const header = document.getElementById('pageHeader');
  if (header) header.textContent = 'Double A — Sales';

  // Run original filter (will load all Sales cards from Firestore)
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

  const header = document.getElementById('pageHeader');
  if (header) header.textContent = 'Products';

  const searchWrap = document.getElementById('searchWrap');
  if (searchWrap) searchWrap.style.display = 'none';

  const cardBox    = document.getElementById('cardBox');
  const adminPanel = document.getElementById('adminPanel');
  if (cardBox)    cardBox.style.display    = 'none';
  if (adminPanel) adminPanel.style.display = 'none';

  const panel = document.getElementById('productsPanel');
  if (panel) { panel.style.display = 'block'; panel.innerHTML = _buildProductsHTML(); }
}

// ── Products HTML ────────────────────────────────────────────

function _buildProductsHTML() {
  return `<div class="products-wrap">${PRODUCTS.map(_buildBrandCard).join('')}</div>`;
}

function _buildBrandCard(brand) {
  const certs    = brand.cert.map(c => `<span class="prod-cert">${c}</span>`).join('');
  const variants = brand.variants.map(v => _buildVariant(v, brand)).join('');
  const waMsg    = encodeURIComponent(brand.shareMsg || `Hi! I need ${brand.name} paper. Satija Paper.`);
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
// AI Q&A
// ─────────────────────────────────────────────────────────────

function openAIQA() {
  window.open(
    'https://chatgpt.com/g/g-6a0c9090a45c81919ac3a2682dfe1dfa-satija-paper-ai-command-center',
    '_blank', 'noopener,noreferrer'
  );
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function _showCardGrid() {
  const el = id => document.getElementById(id);
  const cardBox = el('cardBox');
  if (el('adminPanel'))    el('adminPanel').style.display    = 'none';
  if (el('productsPanel')) el('productsPanel').style.display = 'none';
  if (el('searchWrap'))    el('searchWrap').style.display    = '';
  if (cardBox)             cardBox.style.display             = '';
}

// ─────────────────────────────────────────────────────────────
// PATCHED filterCat — wraps original, sets daMode
// ─────────────────────────────────────────────────────────────

const _origFilterCat = filterCat;
const _origRunFilter = runFilter;

function filterCatPatched(cat, btn) {
  state.curGroup = null;
  // Set daMode BEFORE original runs so observer fires correctly
  state.daMode   = (cat === 'Sales') ? 'hidden' : (cat === 'All') ? 'hidden' : 'all';
  _origFilterCat(cat, btn);
  _syncDoubleAFolder(cat);
  _showCardGrid();
}

function runFilterPatched() {
  _origRunFilter();
  // Observer handles the rest asynchronously
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
  openAIQA,
  secureOpen,
  showAdmin,
  openModal, closeModal, editUser, saveUser, deleteUserAct,
  onRoleChange, selectAllProcs,
});
