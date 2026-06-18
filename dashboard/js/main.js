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
import { canAccessProc }                   from './ui/access.js';
import { PRODUCTS, DB, NAV_TABS }          from './data.js';
import { fetchBankDetails, getBankById } from './services/bank.service.js';
import { BANK_QR }                        from './bank-qr.js';

const _origFilterCat = filterCat;
const _origRunFilter = runFilter;

function enterApp(user) {
  state.curUser  = user;
  state.curGroup = null;
  state.daMode   = 'hidden';
  $('loginOverlay').classList.add('hidden');
  $('appContainer').classList.add('visible');
  paintSidebarUser(user);
  updateCounts();
  renderFiltered();
  // Force Dispatch count from local DB (in case Firestore hasn't been seeded yet)
  _forceLocalCounts();
  _syncDoubleAFolder('All');
  _setProductsCount();
  _startCardObserver();
  _initMobileSidebar();
}


function _forceLocalCounts() {
  // DB and NAV_TABS are imported at top of this file — use them directly
  NAV_TABS.forEach(tab => {
    if (tab.cat === 'All' || tab.cat === 'Products' || tab.cat === 'Bank Details') return;
    const cnt = document.getElementById(tab.cnt);
    if (!cnt) return;
    // Documents counts both 'Documents' and 'Family' (backward compat)
    const n = tab.cat === 'Documents'
      ? DB.filter(d => (d.cat === 'Documents' || d.cat === 'Family') && canAccessProc(state.curUser, d)).length
      : DB.filter(d => d.cat === tab.cat && canAccessProc(state.curUser, d)).length;
    if (n > 0) cnt.textContent = n;
  });
  const cntAll = document.getElementById('cntAll');
  if (cntAll) cntAll.textContent = DB.filter(d => canAccessProc(state.curUser, d)).length;
}

showCheckingSession();
onAuth(async fbUser => {
  if (!fbUser) { state.curUser = null; showLoginScreen(); return; }
  try {
    const profile = await fetchOrCreateProfile(fbUser);
    enterApp(profile);
  } catch (err) { console.error('Profile load failed:', err); showLoginScreen(); }
});

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

function _syncDoubleAFolder(activeCat) {
  const folder = document.getElementById('doubleAFolder');
  if (!folder) return;
  folder.style.display = (activeCat === 'Sales' || activeCat === 'All') ? 'block' : 'none';
  const badge = document.getElementById('cntDoubleA');
  if (badge) badge.textContent = DB.filter(p => p.group === 'Double A' && canAccessProc(state.curUser, p)).length;
}

function _injectDoubleAFolderTile(grid) {
  if (!grid) grid = document.getElementById('cardBox');
  if (!grid || grid.querySelector('.da-folder-tile')) return;
  const daItems = DB.filter(d => d.group === 'Double A' && canAccessProc(state.curUser, d));
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

function openAIQA() {
  window.open(
    'https://chatgpt.com/g/g-6a0c9090a45c81919ac3a2682dfe1dfa-satija-paper-ai-command-center',
    '_blank', 'noopener,noreferrer'
  );
}

function _setProductsCount() {
  const badge = document.getElementById('cntProducts');
  if (badge) badge.textContent = PRODUCTS.length;
}

function showProducts(btn) {
  if (!(state.curUser?.role === 'Admin' || state.curUser?.deptAccess?.includes('All') || state.curUser?.deptAccess?.includes('Products'))) {
    showToast('Access Denied.', 'err');
    return;
  }
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
  _injectShareModal();      // ensure share modal DOM is ready
}

function _buildProductsHTML() {
  return `<div class="products-wrap">${PRODUCTS.map(_buildBrandCard).join('')}</div>`;
}

const _jsq = s => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

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
        <button class="prod-share-btn" onclick="shareProductImage('prod-${brand.id}','${_jsq(brand.name)}')">
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
    <div class="prod-variant-img-wrap prod-variant-img-clickable" style="${v.colorOnly ? 'background:'+v.color+';position:relative' : ''}" onclick="openShareModal('${_jsq(v.name)}','${_jsq(brand.shareMsg || v.name)}')" title="Click to share">
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
      <div class="prod-variant-actions">
        <button class="prod-variant-share" onclick="shareProductImage('${varId}','${_jsq(v.name)}')">
          <i class="fas fa-share-nodes"></i> Share
        </button>
      </div>

    </div>
  </div>`;
}

function _showCardGrid() {
  document.getElementById('adminPanel').style.display    = 'none';
  document.getElementById('productsPanel').style.display = 'none';
  document.getElementById('searchWrap').style.display    = '';
  document.getElementById('cardBox').style.display       = '';
}

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

async function _showPersonalBanks() {
  const panel = document.getElementById('personalBankPanel');
  if (!panel) return;
  const hasAccess = state.curUser?.role === 'Admin'
    || state.curUser?.deptAccess?.includes('All')
    || state.curUser?.deptAccess?.includes('Bank Details');
  if (!hasAccess) return;

  panel.innerHTML = `<div class="bank-loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>`;
  panel.style.display = 'block';
  try {
    const banks = await fetchBankDetails();
    const personal = banks.filter(b => b.group === 'personal');
    if (!personal.length) { panel.style.display = 'none'; panel.innerHTML = ''; return; }
    panel.innerHTML = _buildBankSectionHTML(banks, 'personal', 'Personal Bank Accounts');
  } catch(e) {
    panel.innerHTML = `<div class="bank-loading" style="color:#e53e3e"><i class="fas fa-exclamation-circle"></i> Error: ${e.code || ''} ${e.message || e}</div>`;
  }
}

function filterCatPatched(cat, btn) {
  state.curGroup = null;
  state.daMode   = (cat === 'Sales' || cat === 'All') ? 'hidden' : 'all';
  _origFilterCat(cat, btn);
  _syncDoubleAFolder(cat);
  _showCardGrid();
  if (cat === 'Documents') {
    const h = document.getElementById('pageHeader');
    if (h) h.textContent = 'Documents';
    _showPersonalBanks();
  } else {
    const p = document.getElementById('personalBankPanel');
    if (p) { p.style.display = 'none'; p.innerHTML = ''; }
  }
}

function runFilterPatched() {
  _origRunFilter();
  // Observer handles DA visibility automatically as cards land in DOM
}



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

async function _replaceImgsWithBase64(clone) {
  const imgs = [...clone.querySelectorAll('img')];
  await Promise.all(imgs.map(async img => {
    if (!img.src || img.src.startsWith('data:')) return;
    const b64 = await _toBase64(img.src);
    img.src = b64;
  }));
}
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
        clone.querySelectorAll(
          '.prod-share-btn, .prod-variant-share, .prod-variant-actions, .bank-action-row'
        ).forEach(b => { b.style.display = 'none'; });
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


async function showBankDetails(btn) {
  if (!(state.curUser?.role === 'Admin' || state.curUser?.deptAccess?.includes('All') || state.curUser?.deptAccess?.includes('Bank Details'))) {
    showToast('Access Denied.', 'err');
    return;
  }
  document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  state.curCat   = 'BankDetails';
  state.curGroup = null;
  state.daMode   = 'all';
  document.getElementById('pageHeader').textContent   = 'Bank Details';
  document.getElementById('searchWrap').style.display = 'none';
  document.getElementById('cardBox').style.display    = 'none';
  document.getElementById('adminPanel').style.display = 'none';
  const panel = document.getElementById('productsPanel');
  panel.style.display = 'block';
  const pbp = document.getElementById('personalBankPanel');
  if (pbp) { pbp.style.display = 'none'; pbp.innerHTML = ''; }
  panel.innerHTML = `<div class="products-wrap"><div class="bank-loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div></div>`;
  try {
    const banks = await fetchBankDetails();
    panel.innerHTML = `<div class="products-wrap">` + _buildBankSectionHTML(banks, 'satija_paper') + `</div>`;
  } catch(e) {
    const msg = (e.code || '') + ' ' + (e.message || e);
    panel.innerHTML = `<div class="products-wrap"><div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>${msg}</p></div></div>`;
  }
  _injectShareModal();
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
  openShareModal,
  spShareHide, spShareVia, spShareClose, spShareCopyLink,
  copyBankDetails,
  shareBankDetails,
  showBankDetails,
});


function _buildBankSectionHTML(banks, groupFilter, sectionTitle) {
  const list = groupFilter ? banks.filter(b => b.group === groupFilter) : banks;
  const groups = {};
  list.forEach(b => {
    if (!groups[b.group]) groups[b.group] = { label: b.groupLabel, items: [] };
    groups[b.group].items.push(b);
  });
  const HEADER_CLS = { hsbc:'hsbc', pnb:'pnb', pnb_veena:'pnb', pnb_silky:'pnb', yes_bank:'yes' };
  const groupsHtml = Object.entries(groups).map(([, g]) => {
    const cardsHtml = g.items.map(b => {
      const hcls  = HEADER_CLS[b.id] || 'pnb';
      const cardId = b.id + '-card';
      const nameRow = b.holderName ? `<tr><td>${b.holderName.includes('SATIJA PAPER') ? 'Beneficiary' : 'Name'}</td><td>:</td><td><strong>${b.holderName}</strong></td></tr>` : '';
      const addrRow = b.address ? `<tr><td>Address</td><td>:</td><td>${b.address}</td></tr>` : '';
      const qrHtml  = b.hasQR && BANK_QR[b.id]
        ? `<div class="bank-qr-wrap"><img src="${BANK_QR[b.id]}" alt="${b.bankName} UPI QR"><div class="bank-qr-label">Scan &amp; Pay · ${b.bankName}</div></div>`
        : '';
      return `<div class="bank-card" id="${cardId}">
        <div class="bank-card-header ${hcls}">
          <i class="fas fa-university"></i> ${b.bankName}
        </div>
        <div class="bank-card-body">
          <div class="bank-details-table">
            <table>
              ${nameRow}
              <tr><td>A/C No.</td><td>:</td><td class="bank-acc">${b.accountNo}</td></tr>
              <tr><td>Bank</td><td>:</td><td>${b.bank}</td></tr>
              <tr><td>Branch</td><td>:</td><td>${b.branch}</td></tr>
              <tr><td>IFSC</td><td>:</td><td class="bank-ifsc">${b.ifsc}</td></tr>
              ${addrRow}
            </table>
            <div class="bank-action-row">
              <button class="bank-copy-btn" onclick="copyBankDetails('${b.id}')">
                <i class="fas fa-copy"></i> Copy Details
              </button>
              <button class="bank-share-btn" onclick="shareProductImage('${cardId}','Bank Details ${b.bankName}')">
                <i class="fas fa-share-nodes"></i> Share
              </button>
            </div>
          </div>
          ${qrHtml}
        </div>
      </div>`;
    }).join('');
    return `<div class="bank-group-header"><i class="fas fa-landmark"></i> ${g.label}</div>
<div class="bank-cards-grid">${cardsHtml}</div>`;
  }).join('');
  const title = sectionTitle || 'Bank Details';
  return `<div class="bank-section" id="bankDetailsSection">
    <div class="bank-section-title"><i class="fas fa-landmark"></i> ${title}</div>
    ${groupsHtml}
  </div>`;
}
function shareBankDetails(id) {
  const b = getBankById(id);
  if (!b) return;
  const nameLabel = b.holderName.includes('SATIJA PAPER') ? 'Beneficiary' : 'Name';
  const addrLine  = b.address ? '\nAddress: ' + b.address : '';
  const msg = 'Bank Details — ' + b.bankName + '\n' + nameLabel + ': ' + b.holderName + '\nA/C No.: ' + b.accountNo + '\nBank: ' + b.bank + '\nBranch: ' + b.branch + '\nIFSC: ' + b.ifsc + addrLine + '\nwww.satijapaper.com';
  openShareModal(b.bankName + ' — ' + b.holderName, msg);
}

function copyBankDetails(id) {
  const b = getBankById(id);
  if (!b) return;
  const nameLabel = b.holderName.includes('SATIJA PAPER') ? 'Beneficiary' : 'Name';
  const addrLine  = b.address ? '\nAddress: ' + b.address : '';
  const text = nameLabel + ': ' + b.holderName + '\nA/C No.: ' + b.accountNo + '\nBank: ' + b.bank + '\nBranch: ' + b.branch + '\nIFSC: ' + b.ifsc + addrLine;
  navigator.clipboard.writeText(text).then(() => {
    if (typeof showToast === 'function') showToast('Bank details copied!');
  });
}



/* ── Share Modal ──────────────────────────────────────────────── */
(function _injectShareModal() {
  if (document.getElementById('spShareOverlay')) return;

  const CSS = `
  .sp-share-overlay{position:fixed;inset:0;background:rgba(0,0,0,.52);z-index:9999;
    display:flex;align-items:center;justify-content:center;padding:16px;
    opacity:0;transition:opacity .22s;pointer-events:none;}
  .sp-share-overlay.active{opacity:1;pointer-events:all;}
  .sp-share-box{background:var(--card-bg,#fff);border-radius:22px;
    box-shadow:0 24px 64px rgba(0,0,0,.22);width:100%;max-width:400px;
    padding:28px 28px 24px;position:relative;
    transform:translateY(24px) scale(.97);transition:transform .25s cubic-bezier(.34,1.56,.64,1);}
  .sp-share-overlay.active .sp-share-box{transform:translateY(0) scale(1);}
  .sp-share-close{position:absolute;top:14px;right:16px;background:none;border:none;
    cursor:pointer;color:var(--text-muted,#718096);font-size:18px;padding:4px 8px;
    border-radius:8px;transition:background .15s;}
  .sp-share-close:hover{background:rgba(0,0,0,.06);}
  .sp-share-title{font-size:15px;font-weight:800;color:var(--text,#1a202c);
    margin-bottom:4px;padding-right:32px;line-height:1.3;}
  .sp-share-sub{font-size:12px;color:var(--text-muted,#718096);margin-bottom:20px;font-weight:500;}
  .sp-share-apps{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:22px;}
  .sp-share-app{display:flex;flex-direction:column;align-items:center;gap:7px;
    cursor:pointer;border:none;background:none;padding:0;}
  .sp-share-app-icon{width:52px;height:52px;border-radius:14px;display:flex;
    align-items:center;justify-content:center;font-size:22px;color:#fff;
    transition:transform .15s,box-shadow .15s;}
  .sp-share-app:hover .sp-share-app-icon{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.18);}
  .sp-share-app-label{font-size:10.5px;font-weight:700;color:var(--text-muted,#718096);letter-spacing:.2px;}
  .sp-share-app-icon.wa{background:linear-gradient(135deg,#25d366,#128c7e);}
  .sp-share-app-icon.sms{background:linear-gradient(135deg,#3b82f6,#1d4ed8);}
  .sp-share-app-icon.tg{background:linear-gradient(135deg,#2AABEE,#229ED9);}
  .sp-share-app-icon.copy{background:linear-gradient(135deg,#6366f1,#4338ca);}
  .sp-share-app-icon.mail{background:linear-gradient(135deg,#f59e0b,#d97706);}
  .sp-share-app-icon.more{background:linear-gradient(135deg,#94a3b8,#64748b);}
  .sp-share-link-row{display:flex;gap:8px;align-items:center;}
  .sp-share-link-input{flex:1;border:1.5px solid var(--border,#e2e8f0);border-radius:10px;
    padding:9px 12px;font-size:11.5px;color:var(--text,#1a202c);background:var(--input-bg,#f7fafc);
    font-family:inherit;font-weight:600;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
  .sp-share-copy-btn{padding:9px 16px;background:var(--accent,#4f46e5);color:#fff;
    border:none;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;
    white-space:nowrap;transition:background .15s;}
  .sp-share-copy-btn:hover{background:#4338ca;}
  .sp-share-copy-btn.copied{background:#16a34a;}
  .sp-share-toast{font-size:11px;color:#16a34a;font-weight:700;text-align:center;margin-top:10px;height:16px;}
  `;
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', `
  <div class="sp-share-overlay" id="spShareOverlay" onclick="spShareClose(event)">
    <div class="sp-share-box">
      <button class="sp-share-close" onclick="spShareHide()"><i class="fas fa-xmark"></i></button>
      <div class="sp-share-title" id="spShareTitle">Share Product</div>
      <div class="sp-share-sub">Share via your favourite app</div>
      <div class="sp-share-apps">
        <button class="sp-share-app" onclick="spShareVia('whatsapp')">
          <div class="sp-share-app-icon wa"><i class="fab fa-whatsapp"></i></div>
          <span class="sp-share-app-label">WhatsApp</span>
        </button>
        <button class="sp-share-app" onclick="spShareVia('sms')">
          <div class="sp-share-app-icon sms"><i class="fas fa-comment-sms"></i></div>
          <span class="sp-share-app-label">SMS</span>
        </button>
        <button class="sp-share-app" onclick="spShareVia('telegram')">
          <div class="sp-share-app-icon tg"><i class="fab fa-telegram"></i></div>
          <span class="sp-share-app-label">Telegram</span>
        </button>
        <button class="sp-share-app" onclick="spShareVia('email')">
          <div class="sp-share-app-icon mail"><i class="fas fa-envelope"></i></div>
          <span class="sp-share-app-label">Email</span>
        </button>
        <button class="sp-share-app" onclick="spShareVia('copy')">
          <div class="sp-share-app-icon copy"><i class="fas fa-link"></i></div>
          <span class="sp-share-app-label">Copy Link</span>
        </button>
        <button class="sp-share-app" onclick="spShareVia('native')">
          <div class="sp-share-app-icon more"><i class="fas fa-share-nodes"></i></div>
          <span class="sp-share-app-label">More</span>
        </button>
      </div>
      <div class="sp-share-link-row">
        <input class="sp-share-link-input" id="spShareLinkInput" readonly>
        <button class="sp-share-copy-btn" id="spShareCopyBtn" onclick="spShareCopyLink()">Copy</button>
      </div>
      <div class="sp-share-toast" id="spShareToast"></div>
    </div>
  </div>`);

  document.addEventListener('keydown', e => { if (e.key === 'Escape') spShareHide(); });
})();

let _spMsg = '', _spLink = '';

function openShareModal(title, shareMsg) {
  _spMsg  = shareMsg || title;
  _spLink = 'https://www.satijapaper.com';
  document.getElementById('spShareTitle').textContent = 'Share — ' + title;
  document.getElementById('spShareLinkInput').value   = _spLink;
  document.getElementById('spShareToast').textContent = '';
  const btn = document.getElementById('spShareCopyBtn');
  btn.textContent = 'Copy'; btn.classList.remove('copied');
  const ov = document.getElementById('spShareOverlay');
  ov.style.display = 'flex';
  requestAnimationFrame(() => ov.classList.add('active'));
}
function spShareHide() {
  const ov = document.getElementById('spShareOverlay');
  ov.classList.remove('active');
  setTimeout(() => { ov.style.display = 'none'; }, 240);
}
function spShareClose(e) {
  if (e.target === document.getElementById('spShareOverlay')) spShareHide();
}
function spShareVia(app) {
  const text = encodeURIComponent(_spMsg);
  const url  = encodeURIComponent(_spLink);
  const map  = {
    whatsapp: `https://wa.me/?text=${text}`,
    sms:      `sms:?body=${text}`,
    telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    email:    `mailto:?subject=${encodeURIComponent('Satija Paper – Product Info')}&body=${text}`
  };
  if (app === 'copy')   { spShareCopyLink(); return; }
  if (app === 'native') {
    if (navigator.share) navigator.share({ title: 'Satija Paper', text: _spMsg, url: _spLink }).catch(()=>{});
    else spShareCopyLink();
    return;
  }
  window.open(map[app], '_blank');
}
function spShareCopyLink() {
  navigator.clipboard.writeText(_spMsg + '\n' + _spLink).then(() => {
    const btn = document.getElementById('spShareCopyBtn');
    const toast = document.getElementById('spShareToast');
    btn.textContent = 'Copied!'; btn.classList.add('copied');
    toast.textContent = '✓ Copied to clipboard';
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); toast.textContent = ''; }, 2500);
  });
}
