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
// PATCHED originals — defined FIRST so all functions can use them
// ─────────────────────────────────────────────────────────────
const _origFilterCat = filterCat;
const _origRunFilter = runFilter;

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
  _initMobileSidebar();
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
// MOBILE SIDEBAR
// ─────────────────────────────────────────────────────────────
function _initMobileSidebar() {
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
  if (!document.getElementById('sidebarBackdrop')) {
    const bd = document.createElement('div');
    bd.id        = 'sidebarBackdrop';
    bd.className = 'sidebar-backdrop';
    bd.addEventListener('click', _closeSidebar);
    document.body.appendChild(bd);
  }
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

// ─────────────────────────────────────────────────────────────
// MUTATION OBSERVER — reliable async card visibility
// ─────────────────────────────────────────────────────────────
let _observer = null;

function _startCardObserver() {
  const grid = document.getElementById('cardBox');
  if (!grid || _observer) return;
  _observer = new MutationObserver(_applyDAVisibility);
  _observer.observe(grid, { childList: true });
}

function _applyDAVisibility() {
  const grid = document.getElementById('cardBox');
  if (!grid) return;
  const daNames = new Set(DB.filter(d => d.group === 'Double A').map(d => d.name));

  if (state.daMode === 'hidden') {
    grid.querySelectorAll('.card[data-name]').forEach(card => {
      card.style.display = daNames.has(card.dataset.name) ? 'none' : '';
    });
    if (!grid.querySelector('.da-folder-tile')) _injectDoubleAFolderTile(grid);

  } else if (state.daMode === 'only') {
    grid.querySelector('.da-folder-tile')?.remove();
    grid.querySelectorAll('.card[data-name]').forEach(card => {
      card.style.display = daNames.has(card.dataset.name) ? '' : 'none';
    });

  } else {
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

  tile.addEventListener('click', () => filterGroup('Double A', document.getElementById('navDoubleA')));
  grid.appendChild(tile);
}

// ─────────────────────────────────────────────────────────────
// filterGroup — Double A sidebar/tile click
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
  _origRunFilter();   // safe now — defined at top of file
}

// ─────────────────────────────────────────────────────────────
// AI Q&A — direct link, no Cloud Function
// ─────────────────────────────────────────────────────────────
function openAIQA() {
  window.open(
    'https://chatgpt.com/g/g-6a0c9090a45c81919ac3a2682dfe1dfa-satija-paper-ai-command-center',
    '_blank', 'noopener,noreferrer'
  );
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
        <button class="prod-share-btn" onclick="shareProductImage('prod-${brand.id}','${brand.name}')">
          <i class="fas fa-share-nodes"></i> Share
        </button>
      </div>
    </div>
    <div class="prod-variants-grid">${variants}</div>
  </div>`;
}

function _buildVariant(v, brand) {
  const sizes  = v.sizes.map(s => `<span class="prod-size-pill">${s}</span>`).join('');
  const imgSrc = brand.img;   // brand logo used; external hotlinks (Amazon/IndiaMART) are blocked
  const extras = [
    v.cie       ? `<div class="prod-spec"><span>CIE</span><strong>${v.cie}</strong></div>`             : '',
    v.opacity   ? `<div class="prod-spec"><span>Opacity</span><strong>${v.opacity}</strong></div>`     : '',
    v.thickness ? `<div class="prod-spec"><span>Thickness</span><strong>${v.thickness}</strong></div>` : '',
    v.sheets    ? `<div class="prod-spec"><span>Sheets/Ream</span><strong>${v.sheets}</strong></div>`  : '',
  ].filter(Boolean).join('');
  const varId = `prod-var-${brand.id}-${v.gsm}`;
  return `
  <div class="prod-variant-card" id="${varId}">
    <div class="prod-variant-img-wrap">
      <img src="${imgSrc}" alt="${v.name}" class="prod-variant-img"
           onerror="this.onerror=null;this.src='https://satijapaper.com/SP.jpg'">
      <span class="prod-variant-gsm-badge">${v.gsm} GSM</span>
    </div>
    <div class="prod-variant-info">
      <div class="prod-variant-name">${v.name}</div>
      <div class="prod-spec-row">
        <div class="prod-spec"><span>Brightness</span><strong>${v.brightness}</strong></div>
        ${extras}
      </div>
      <div class="prod-sizes-row">${sizes}</div>
      <div class="prod-bestfor"><i class="fas fa-circle-check"></i> ${v.bestFor}</div>
      <button class="prod-variant-share" onclick="shareProductImage('${varId}','${v.name}')">
        <i class="fas fa-share-nodes"></i> Share
      </button>
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
function filterCatPatched(cat, btn) {
  state.curGroup = null;
  state.daMode   = (cat === 'Sales' || cat === 'All') ? 'hidden' : 'all';
  _origFilterCat(cat, btn);
  _syncDoubleAFolder(cat);
  _showCardGrid();
}

function runFilterPatched() {
  _origRunFilter();
  // Observer handles DA visibility automatically as cards land in DOM
}

// ─────────────────────────────────────────────────────────────
// EXPOSE TO WINDOW
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// SHARE AS IMAGE — html2canvas + Web Share API
// ─────────────────────────────────────────────────────────────

/**
 * Capture a product card/variant as image and open native share sheet.
 * Falls back to download if Web Share API unavailable.
 * @param {string} elementId  - id of the element to capture
 * @param {string} label      - used for filename
 */
async function shareProductImage(elementId, label) {
  const el = document.getElementById(elementId);
  if (!el) { showToast('Element not found.', 'err'); return; }

  // Show loading state on button
  const btn = el.querySelector('.prod-share-btn, .prod-variant-share');
  const origHTML = btn ? btn.innerHTML : '';
  if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Capturing...';

  try {
    // Load html2canvas if not already loaded
    await _loadHtml2Canvas();

    // Temporarily expand card so nothing is clipped
    const prevOverflow = el.style.overflow;
    el.style.overflow = 'visible';

    const canvas = await html2canvas(el, {
      useCORS:        true,
      allowTaint:     false,
      backgroundColor: '#ffffff',
      scale:          2,           // 2x for sharp image on retina
      logging:        false,
      imageTimeout:   8000,
      onclone: (doc, clone) => {
        // Hide share buttons in the captured image
        clone.querySelectorAll('.prod-share-btn, .prod-variant-share').forEach(b => {
          b.style.display = 'none';
        });
        // Ensure brand header image visible
        clone.querySelectorAll('img').forEach(img => {
          img.crossOrigin = 'anonymous';
        });
      }
    });

    el.style.overflow = prevOverflow;

    // Convert to blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.95));
    const fileName = `${label.replace(/[^a-z0-9]/gi, '_')}_SatijaPaper.png`;

    // Try Web Share API (works on mobile Chrome/Safari)
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], fileName, { type: 'image/png' })] })) {
      const file = new File([blob], fileName, { type: 'image/png' });
      await navigator.share({
        files: [file],
        title: `${label} — Satija Paper`,
        text:  `${label} — Available at Satija Paper (www.satijapaper.com)`
      });
      showToast('Shared!', 'info');

    } else {
      // Fallback: download image
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href     = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Image downloaded — share manually.', 'info');
    }

  } catch (err) {
    console.error('Share error:', err);
    showToast('Could not capture image. Try again.', 'err');
  } finally {
    if (btn) btn.innerHTML = origHTML;
  }
}

/** Dynamically load html2canvas from CDN (loaded once, cached). */
function _loadHtml2Canvas() {
  if (window.html2canvas) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s   = document.createElement('script');
    s.src     = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    s.onload  = resolve;
    s.onerror = () => reject(new Error('html2canvas failed to load'));
    document.head.appendChild(s);
  });
}

Object.assign(window, {
  handleLogin, handleLogout, forgotPass, togglePwd,
  filterCat:     filterCatPatched,
  runFilter:     runFilterPatched,
  filterGroup,
  showProducts,
  openAIQA,
  secureOpen,
  showAdmin,
  openModal, closeModal, editUser, saveUser, deleteUserAct,
  onRoleChange, selectAllProcs,
  toggleSidebar: _toggleSidebar,
  shareProductImage,
});
