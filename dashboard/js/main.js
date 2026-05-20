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
  state.curUser       = user;
  state.curGroup      = null;
  state.hideDoubleA   = true;   // Double A cards hidden from main Sales view
  $('loginOverlay').classList.add('hidden');
  $('appContainer').classList.add('visible');
  paintSidebarUser(user);
  updateCounts();
  renderFiltered();
  _syncDoubleAFolder('All');
  _setProductsCount();
}

showCheckingSession();

onAuth(async fbUser => {
  if (!fbUser) {
    state.curUser = null;
    showLoginScreen();
    return;
  }
  try {
    const profile = await fetchOrCreateProfile(fbUser);
    enterApp(profile);
  } catch (err) {
    console.error('Profile load failed:', err);
    showLoginScreen();
  }
});

// ─────────────────────────────────────────────────────────────
// DOUBLE A FOLDER
// ─────────────────────────────────────────────────────────────

/** Show/hide the Double A sub-folder link in sidebar. */
function _syncDoubleAFolder(activeCat) {
  const folder = document.getElementById('doubleAFolder');
  if (!folder) return;
  folder.style.display = (activeCat === 'Sales' || activeCat === 'All') ? 'block' : 'none';
  const badge = document.getElementById('cntDoubleA');
  if (badge) badge.textContent = DB.filter(p => p.group === 'Double A').length;
}

/**
 * Show Sales cards with an embedded Double A folder tile.
 * Called when navSales is clicked — NOT filterGroup.
 * Double A items are hidden from the card grid; instead a
 * single folder tile appears that expands inline.
 */
function filterGroup(group, btn) {
  document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _syncDoubleAFolder('Sales');
  _showCardGrid();

  state.curCat        = 'Sales';
  state.curGroup      = group;
  state.hideDoubleA   = false;   // show ONLY Double A cards

  const header = document.getElementById('pageHeader');
  if (header) header.textContent = 'Double A — Sales';

  runFilterPatched();
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

  const header = document.getElementById('pageHeader');
  if (header) header.textContent = 'Products';

  const searchWrap = document.getElementById('searchWrap');
  if (searchWrap) searchWrap.style.display = 'none';

  const cardBox    = document.getElementById('cardBox');
  const adminPanel = document.getElementById('adminPanel');
  if (cardBox)    cardBox.style.display    = 'none';
  if (adminPanel) adminPanel.style.display = 'none';

  const panel = document.getElementById('productsPanel');
  if (panel) {
    panel.style.display = 'block';
    panel.innerHTML     = _buildProductsHTML();
  }
}

// ── Products HTML builders ───────────────────────────────────

function _buildProductsHTML() {
  return `<div class="products-wrap">${PRODUCTS.map(_buildBrandCard).join('')}</div>`;
}

function _buildBrandCard(brand) {
  const certs    = brand.cert.map(c => `<span class="prod-cert">${c}</span>`).join('');
  const variants = brand.variants.map(v => _buildVariant(v, brand)).join('');

  // WhatsApp share URL for this brand
  const waMsg = encodeURIComponent(brand.shareMsg || `Hi! I am interested in ${brand.name} paper from Satija Paper. Please share pricing. www.satijapaper.com`);
  const waUrl = `https://wa.me/919899708098?text=${waMsg}`;

  return `
  <div class="prod-brand-card" id="prod-${brand.id}">
    <div class="prod-brand-header">
      <div class="prod-brand-img-wrap">
        <img src="${brand.img}" alt="${brand.name}" class="prod-brand-img"
             onerror="this.onerror=null;this.src='https://satijapaper.com/logo.png'">
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
  const sizes   = v.sizes.map(s => `<span class="prod-size-pill">${s}</span>`).join('');
  // Each variant now has its own img + fallbackImg
  const imgSrc  = v.img || brand.img;
  const fbSrc   = v.fallbackImg || brand.img;

  const extras = [
    v.cie       ? `<div class="prod-spec"><span>CIE</span><strong>${v.cie}</strong></div>`             : '',
    v.opacity   ? `<div class="prod-spec"><span>Opacity</span><strong>${v.opacity}</strong></div>`     : '',
    v.thickness ? `<div class="prod-spec"><span>Thickness</span><strong>${v.thickness}</strong></div>` : '',
    v.sheets    ? `<div class="prod-spec"><span>Sheets/Ream</span><strong>${v.sheets}</strong></div>`  : '',
  ].filter(Boolean).join('');

  // Per-variant WhatsApp share
  const waMsg = encodeURIComponent(`Hi! I am interested in ${v.name} (${v.sizes.join('/')}) from Satija Paper. Please share pricing. www.satijapaper.com`);
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
// AI Q&A — direct external link, no Cloud Function
// ─────────────────────────────────────────────────────────────

function openAIQA() {
  window.open(
    'https://chatgpt.com/g/g-6a0c9090a45c81919ac3a2682dfe1dfa-satija-paper-ai-command-center',
    '_blank',
    'noopener,noreferrer'
  );
}

// ─────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────

function _showCardGrid() {
  const cardBox       = document.getElementById('cardBox');
  const adminPanel    = document.getElementById('adminPanel');
  const productsPanel = document.getElementById('productsPanel');
  const searchWrap    = document.getElementById('searchWrap');
  if (cardBox)        cardBox.style.display       = '';
  if (adminPanel)     adminPanel.style.display    = 'none';
  if (productsPanel)  productsPanel.style.display = 'none';
  if (searchWrap)     searchWrap.style.display    = '';
}

// ─────────────────────────────────────────────────────────────
// PATCHED filterCat
// Adds: Double A folder sync + group reset + card grid restore.
// Also inserts a Double A folder TILE into the Sales card grid.
// ─────────────────────────────────────────────────────────────

const _origFilterCat = filterCat;

function filterCatPatched(cat, btn) {
  state.curGroup    = null;
  state.hideDoubleA = (cat === 'Sales' || cat === 'All'); // hide DA from main sales view
  _origFilterCat(cat, btn);
  _syncDoubleAFolder(cat);
  _showCardGrid();

  // After the original renderFiltered() paints, inject the Double A folder tile
  if (cat === 'Sales') {
    requestAnimationFrame(() => _injectDoubleAFolderTile());
  }
}

/**
 * Inject a "Double A" folder tile into the card grid
 * right before where the DA items would appear.
 * Shows 3 process names inside the tile.
 * Clicking opens them via filterGroup().
 */
function _injectDoubleAFolderTile() {
  const grid = document.getElementById('cardBox');
  if (!grid) return;
  // Remove existing folder tile if any
  const existing = grid.querySelector('.da-folder-tile');
  if (existing) existing.remove();

  const daItems = DB.filter(d => d.group === 'Double A');
  if (!daItems.length) return;

  const listItems = daItems.map(d =>
    `<div class="da-folder-item"><i class="fas fa-file-lines"></i> ${d.name}</div>`
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
    <div class="da-folder-footer">
      <span><i class="fas fa-arrow-right"></i> Click to open Double A processes</span>
    </div>`;

  tile.addEventListener('click', () => {
    const navDA = document.getElementById('navDoubleA');
    if (navDA) filterGroup('Double A', navDA);
  });

  // Append at end of grid
  grid.appendChild(tile);
}

// ─────────────────────────────────────────────────────────────
// PATCHED runFilter
// Hides Double A cards from main Sales view (they live in folder tile).
// When curGroup === 'Double A', shows ONLY DA cards.
// ─────────────────────────────────────────────────────────────

const _origRunFilter = runFilter;

function runFilterPatched() {
  _origRunFilter();

  requestAnimationFrame(() => {
    const cards = document.querySelectorAll('#cardBox .proc-card, #cardBox [data-name]');

    if (state.curGroup === 'Double A') {
      // Show only Double A cards
      cards.forEach(card => {
        const name = card.dataset.name;
        const item = name ? DB.find(d => d.name === name) : null;
        card.style.display = (item && item.group === 'Double A') ? '' : 'none';
      });
      return;
    }

    if (state.hideDoubleA) {
      // Hide Double A cards from main Sales / All view
      cards.forEach(card => {
        const name = card.dataset.name;
        if (!name) return;
        const item = DB.find(d => d.name === name);
        if (item && item.group === 'Double A') {
          card.style.display = 'none';
        }
      });
      // Re-inject folder tile if in Sales view
      if (state.curCat === 'Sales') {
        _injectDoubleAFolderTile();
      }
    }
  });
}

// ─────────────────────────────────────────────────────────────
// EXPOSE TO WINDOW
// ─────────────────────────────────────────────────────────────

Object.assign(window, {
  // Auth
  handleLogin, handleLogout, forgotPass, togglePwd,
  // Navigation — patched versions
  filterCat:   filterCatPatched,
  runFilter:   runFilterPatched,
  filterGroup,        // Double A sub-folder
  showProducts,       // Products page
  openAIQA,           // AI Q&A direct link
  // Cards
  secureOpen,
  // Admin
  showAdmin,
  openModal, closeModal, editUser, saveUser, deleteUserAct,
  onRoleChange, selectAllProcs,
});
