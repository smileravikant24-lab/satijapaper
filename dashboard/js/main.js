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
import { showAdmin as _origShowAdmin }     from './admin/admin.view.js';
import {
  openModal, closeModal, editUser, saveUser, deleteUserAct,
  onRoleChange, selectAllProcs
}                                          from './admin/modal.view.js';
import { PRODUCTS, DB, NAV_TABS }          from './data.js';

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
  // Products button — always visible to ALL users regardless of dept access
  const _navProd = document.getElementById('navProducts');
  if (_navProd) _navProd.closest('button') && (_navProd.style.display = '');
  // Force navProducts parent visible
  const _prodBtn = document.getElementById('navProducts');
  if (_prodBtn) { _prodBtn.style.display = ''; _prodBtn.parentElement && (_prodBtn.parentElement.style.display = ''); }
  // Force Dispatch count from local DB (in case Firestore hasn't been seeded yet)
  _forceLocalCounts();
  _syncDoubleAFolder('All');
  _setProductsCount();
  _startCardObserver();
  _initMobileSidebar();
}


/** Force sidebar count badges from local DB — ensures Dispatch shows 1 even before seed. */
function _forceLocalCounts() {
  // DB and NAV_TABS are imported at top of this file — use them directly
  NAV_TABS.forEach(tab => {
    if (tab.cat === 'All' || tab.cat === 'Products') return;
    const cnt = document.getElementById(tab.cnt);
    if (!cnt) return;
    // Documents counts both 'Documents' and 'Family' (backward compat)
    const n = tab.cat === 'Documents'
      ? DB.filter(d => d.cat === 'Documents' || d.cat === 'Family').length
      : DB.filter(d => d.cat === tab.cat).length;
    if (n > 0) cnt.textContent = n;
  });
  const cntAll = document.getElementById('cntAll');
  if (cntAll) cntAll.textContent = DB.length;
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
  _lazyLoadImages(panel);   // load images as they scroll into view
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
  // v.img may be a resolved _IMG value (base64 data: URL) or an external URL
  // Use v.img if it exists and is not identical to brand logo
  const imgSrc = (v.img && v.img.length > 10) ? v.img : brand.img;

  // Standard spec badges
  const extras = [
    v.cie       ? `<div class="prod-spec"><span>CIE</span><strong>${v.cie}</strong></div>`             : '',
    v.opacity   ? `<div class="prod-spec"><span>Opacity</span><strong>${v.opacity}</strong></div>`     : '',
    v.thickness ? `<div class="prod-spec"><span>Thickness</span><strong>${v.thickness}</strong></div>` : '',
    v.sheets    ? `<div class="prod-spec"><span>Sheets/Ream</span><strong>${v.sheets}</strong></div>`  : '',
    (v.color && v.colorName) ? `<div class="prod-spec prod-spec-color">
        <span>Colour</span>
        <strong><span class="prod-color-dot" style="background:${v.color};border:1px solid rgba(0,0,0,.12)"></span>${v.colorName}</strong>
      </div>` : '',
  ].filter(Boolean).join('');

  // Feature bullet list (used when spec sheet has text features, e.g. K Bold)
  const featureList = v.features && v.features.length
    ? `<ul class="prod-feature-list">${v.features.map(f => `<li><i class="fas fa-check"></i>${f}</li>`).join('')}</ul>`
    : '';

  const varId = `prod-var-${brand.id}-${v.gsm}`;
  return `
  <div class="prod-variant-card" id="${varId}">
    <div class="prod-variant-img-wrap" style="${v.colorOnly ? 'background:'+v.color+';position:relative' : ''}">
      ${v.colorOnly
        ? `<div class="prod-colour-swatch" style="background:${v.color}">
             <span class="prod-colour-name-big">${v.colorName}</span>
           </div>`
        : `<img data-src="${imgSrc}" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
               alt="${v.name}" class="prod-variant-img prod-lazy"
               onerror="this.onerror=null;this.src='https://satijapaper.com/SP.jpg'">`
      }
      <span class="prod-variant-gsm-badge">${v.gsm} GSM</span>
    </div>
    <div class="prod-variant-info">
      <div class="prod-variant-name">${v.name}</div>
      <div class="prod-spec-row">
        <div class="prod-spec"><span>Brightness</span><strong>${v.brightness}</strong></div>
        ${extras}
      </div>
      <div class="prod-sizes-row">${sizes}</div>
      ${featureList}
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

/** Wrap showAdmin to always hide productsPanel and show adminPanel */
function showAdmin(btn) {
  // Deactivate all nav buttons
  document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  // Hide everything else
  const pp = document.getElementById('productsPanel');
  const sw = document.getElementById('searchWrap');
  const cb = document.getElementById('cardBox');
  const ap = document.getElementById('adminPanel');
  if (pp) pp.style.display = 'none';
  if (sw) sw.style.display = 'none';
  if (cb) cb.style.display = 'none';

  // Show admin panel explicitly BEFORE calling orig (which loads users)
  if (ap) ap.style.display = 'block';

  state.curCat   = '__admin__';
  state.curGroup = null;
  state.daMode   = 'all';

  // Update page header
  const header = document.getElementById('pageHeader');
  if (header) header.textContent = 'User Management';

  _origShowAdmin(btn);
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
  // Fix pageHeader for Documents
  if (cat === 'Documents') {
    const h = document.getElementById('pageHeader');
    if (h) h.textContent = 'Documents';
  }
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
// Images pre-converted to base64 to bypass CORS restrictions
// ─────────────────────────────────────────────────────────────

/** Cache: url → base64 dataURL */
const _imgCache = new Map();

/** Fetch an image URL and return a base64 dataURL (bypasses CORS for canvas). */
async function _toBase64(url) {
  if (!url) return url;
  // Already base64 (embedded Khanna images) — return as-is
  if (url.startsWith('data:')) return url;
  if (_imgCache.has(url)) return _imgCache.get(url);
  try {
    const res  = await fetch(url, { mode: 'cors', cache: 'force-cache' });
    const blob = await res.blob();
    const b64  = await new Promise(res => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.readAsDataURL(blob);
    });
    _imgCache.set(url, b64);
    return b64;
  } catch {
    return url;
  }
}

/**
 * Replace all <img src="..."> inside a cloned element with base64 versions.
 * Called inside html2canvas onclone so the canvas sees local data.
 */
async function _replaceImgsWithBase64(clone) {
  const imgs = [...clone.querySelectorAll('img')];
  await Promise.all(imgs.map(async img => {
    if (!img.src || img.src.startsWith('data:')) return;
    const b64 = await _toBase64(img.src);
    img.src = b64;
  }));
}

/**
 * Capture a product card/variant as image and open native share sheet.
 * @param {string} elementId  - id of the element to capture
 * @param {string} label      - used for filename
 */
async function shareProductImage(elementId, label) {
  const el = document.getElementById(elementId);
  if (!el) { showToast('Element not found.', 'err'); return; }

  // Show loading state on clicked button
  const btn = el.querySelector('.prod-share-btn, .prod-variant-share');
  const origHTML = btn ? btn.innerHTML : '';
  if (btn) {
    btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
    btn.disabled   = true;
  }

  try {
    await _loadHtml2Canvas();

    const canvas = await html2canvas(el, {
      useCORS:         true,
      allowTaint:      true,
      backgroundColor: '#ffffff',
      scale:           2,
      logging:         false,
      imageTimeout:    12000,
      onclone: async (doc, clone) => {
        // 1. Hide share buttons so they don't appear in the image
        clone.querySelectorAll('.prod-share-btn, .prod-variant-share').forEach(b => {
          b.style.display = 'none';
        });
        // 2. Convert all images to base64 to bypass CORS
        await _replaceImgsWithBase64(clone);
      }
    });

    const blob     = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.95));
    const fileName = `${label.replace(/[^a-z0-9]/gi, '_')}_SatijaPaper.png`;

    // Web Share API — works on mobile (Chrome Android, Safari iOS)
    if (navigator.share && navigator.canShare &&
        navigator.canShare({ files: [new File([blob], fileName, { type: 'image/png' })] })) {
      await navigator.share({
        files: [new File([blob], fileName, { type: 'image/png' })],
        title: `${label} — Satija Paper`,
        text:  `${label} | Satija Paper — www.satijapaper.com`
      });
      showToast('Shared!', 'info');
    } else {
      // Desktop fallback: download
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href     = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Image saved — share it from your downloads.', 'info');
    }

  } catch (err) {
    console.error('Share error:', err);
    showToast('Could not capture. Try again.', 'err');
  } finally {
    if (btn) { btn.innerHTML = origHTML; btn.disabled = false; }
  }
}

/** Dynamically load html2canvas from CDN once, then cache on window. */
function _loadHtml2Canvas() {
  if (window.html2canvas) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s   = document.createElement('script');
    s.src     = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    s.onload  = resolve;
    s.onerror = () => reject(new Error('html2canvas load failed'));
    document.head.appendChild(s);
  });
}


// ─────────────────────────────────────────────────────────────
// LAZY IMAGE LOADER — IntersectionObserver
// base64 (data:) images → load immediately (already in memory)
// External URL images → load on scroll
// ─────────────────────────────────────────────────────────────
function _lazyLoadImages(container) {
  const imgs = [...container.querySelectorAll('img.prod-lazy[data-src]')];
  if (!imgs.length) return;

  imgs.forEach(img => {
    const src = img.dataset.src;
    // base64 images are already in memory — load immediately, no observer needed
    if (!src || src.startsWith('data:')) {
      img.src = src || '';
      img.removeAttribute('data-src');
      img.classList.remove('prod-lazy');
    }
  });

  // For remaining external URL images, use IntersectionObserver
  const remaining = [...container.querySelectorAll('img.prod-lazy[data-src]')];
  if (!remaining.length) return;

  if (!('IntersectionObserver' in window)) {
    remaining.forEach(img => { img.src = img.dataset.src; img.classList.remove('prod-lazy'); });
    return;
  }

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.classList.remove('prod-lazy');
      observer.unobserve(img);
    });
  }, { rootMargin: '300px 0px' });

  remaining.forEach(img => obs.observe(img));
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
