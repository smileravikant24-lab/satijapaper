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
  state.curUser  = user;
  state.curGroup = null;
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

/**
 * Show/hide the Double A sub-folder in the sidebar.
 * Called whenever filterCat() changes the active category.
 * @param {string} activeCat
 */
function _syncDoubleAFolder(activeCat) {
  const folder = document.getElementById('doubleAFolder');
  if (!folder) return;

  const visible = (activeCat === 'Sales' || activeCat === 'All');
  folder.style.display = visible ? 'block' : 'none';

  // Update badge count
  const cnt   = DB.filter(p => p.group === 'Double A').length;
  const badge = document.getElementById('cntDoubleA');
  if (badge) badge.textContent = cnt;
}

/**
 * Filter cards to only the Double A sub-group.
 * Bound to onclick="filterGroup('Double A', this)" in the sidebar.
 * @param {string} group
 * @param {HTMLElement} btn
 */
function filterGroup(group, btn) {
  // Deactivate all nav buttons
  document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Show Double A folder still open
  const folder = document.getElementById('doubleAFolder');
  if (folder) folder.style.display = 'block';

  state.curCat   = 'Sales';
  state.curGroup = group;

  const header = document.getElementById('pageHeader');
  if (header) header.textContent = 'Double A — Sales';

  // Show search, hide admin & products panels
  _showCardGrid();

  runFilter();
}

// ─────────────────────────────────────────────────────────────
// PRODUCTS PAGE
// ─────────────────────────────────────────────────────────────

/** Set Products badge count to number of brands. */
function _setProductsCount() {
  const badge = document.getElementById('cntProducts');
  if (badge) badge.textContent = PRODUCTS.length;
}

/**
 * Render the Products catalogue page.
 * Bound to onclick="showProducts(this)" in the sidebar.
 * @param {HTMLElement} btn
 */
function showProducts(btn) {
  document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  state.curCat   = 'Products';
  state.curGroup = null;

  // Update page header
  const header = document.getElementById('pageHeader');
  if (header) header.textContent = 'Products';

  // Hide search bar (not needed for static catalogue)
  const searchWrap = document.getElementById('searchWrap');
  if (searchWrap) searchWrap.style.display = 'none';

  // Hide card grid & admin panel
  const cardBox    = document.getElementById('cardBox');
  const adminPanel = document.getElementById('adminPanel');
  if (cardBox)    cardBox.style.display    = 'none';
  if (adminPanel) adminPanel.style.display = 'none';

  // Show + render products panel
  const panel = document.getElementById('productsPanel');
  if (panel) {
    panel.style.display = 'block';
    panel.innerHTML = _buildProductsHTML();
  }
}

/** Build the full Products catalogue HTML string. */
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
             onerror="this.onerror=null;this.src='https://via.placeholder.com/140x90?text=${encodeURIComponent(brand.name)}'">
      </div>
      <div class="prod-brand-meta">
        <h3 class="prod-brand-name">${brand.fullName || brand.name}</h3>
        <div class="prod-brand-origin"><i class="fas fa-location-dot"></i> ${brand.origin}</div>
        <p class="prod-brand-tagline">${brand.tagline}</p>
        <div class="prod-cert-row">${certs}</div>
      </div>
      <div class="prod-enquire-wrap">
        <a href="https://www.satijapaper.com/#enquiry" target="_blank"
           rel="noopener noreferrer" class="prod-enquire-btn">
          <i class="fas fa-envelope"></i> Enquire
        </a>
      </div>
    </div>
    <div class="prod-variants-grid">${variants}</div>
  </div>`;
}

function _buildVariant(v, brand) {
  const sizes  = v.sizes.map(s => `<span class="prod-size-pill">${s}</span>`).join('');
  const img    = (brand.productImg && brand.productImg[v.gsm]) ? brand.productImg[v.gsm] : brand.img;
  const extras = [
    v.cie       ? `<div class="prod-spec"><span>CIE</span><strong>${v.cie}</strong></div>`             : '',
    v.opacity   ? `<div class="prod-spec"><span>Opacity</span><strong>${v.opacity}</strong></div>`     : '',
    v.thickness ? `<div class="prod-spec"><span>Thickness</span><strong>${v.thickness}</strong></div>` : '',
    v.sheets    ? `<div class="prod-spec"><span>Sheets/Ream</span><strong>${v.sheets}</strong></div>`  : '',
  ].filter(Boolean).join('');

  return `
  <div class="prod-variant-card">
    <div class="prod-variant-img-wrap">
      <img src="${img}" alt="${v.name}" class="prod-variant-img"
           onerror="this.onerror=null;this.src='${brand.img}'">
    </div>
    <div class="prod-variant-info">
      <div class="prod-variant-name">${v.name}</div>
      <div class="prod-spec-row">
        <div class="prod-spec"><span>Brightness</span><strong>${v.brightness}</strong></div>
        ${extras}
      </div>
      <div class="prod-sizes-row">${sizes}</div>
      <div class="prod-bestfor"><i class="fas fa-circle-check"></i> ${v.bestFor}</div>
    </div>
  </div>`;
}

// ─────────────────────────────────────────────────────────────
// AI Q&A — direct external link, no Cloud Function needed
// ─────────────────────────────────────────────────────────────

/**
 * Called by the AI Q&A button on Sales process cards.
 * Opens the Satija Paper AI Command Center in a new tab.
 */
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

/** Restore the standard card-grid view (used by filterCat / filterGroup). */
function _showCardGrid() {
  const cardBox      = document.getElementById('cardBox');
  const adminPanel   = document.getElementById('adminPanel');
  const productsPanel = document.getElementById('productsPanel');
  const searchWrap   = document.getElementById('searchWrap');

  if (cardBox)       cardBox.style.display       = '';
  if (adminPanel)    adminPanel.style.display    = 'none';
  if (productsPanel) productsPanel.style.display = 'none';
  if (searchWrap)    searchWrap.style.display    = '';
}

// ─────────────────────────────────────────────────────────────
// PATCHED filterCat — syncs Double A folder + resets group
// ─────────────────────────────────────────────────────────────
/**
 * Wraps the imported filterCat so we can hook in Double A folder
 * visibility and group-reset without touching sidebar.view.js.
 */
const _origFilterCat = filterCat;
function filterCatPatched(cat, btn) {
  state.curGroup = null;      // always reset group when switching category
  _origFilterCat(cat, btn);   // original sidebar.view logic
  _syncDoubleAFolder(cat);    // show/hide Double A folder
  _showCardGrid();            // make sure card grid is visible
}

// ─────────────────────────────────────────────────────────────
// PATCHED runFilter — respects curGroup (Double A filter)
// ─────────────────────────────────────────────────────────────
/**
 * Wraps the imported runFilter.
 * After the standard filter runs, if a curGroup is set we
 * further narrow the rendered cards to that group only.
 *
 * NOTE: if your renderFiltered() in cards.view.js accepts a
 * filter predicate, you may prefer to pass the group filter
 * there directly. This wrapper approach requires zero changes
 * to cards.view.js.
 */
const _origRunFilter = runFilter;
function runFilterPatched() {
  if (state.curGroup) {
    // Temporarily override cat to Sales so sidebar.view counts correctly,
    // then re-render with group predicate applied after the DOM settles.
    _origRunFilter();

    // After renderFiltered() has painted, hide cards that don't match the group
    requestAnimationFrame(() => {
      const cards = document.querySelectorAll('#cardBox .proc-card');
      cards.forEach(card => {
        const procName = card.dataset.name || card.getAttribute('data-name');
        if (!procName) return;
        const { DB: db } = window.__satija_data__ || {};
        // Prefer the data already imported at module level
        const item = DB.find(d => d.name === procName);
        if (item) {
          card.style.display = (item.group === state.curGroup) ? '' : 'none';
        }
      });
    });
    return;
  }
  _origRunFilter();
}

// ─────────────────────────────────────────────────────────────
// EXPOSE TO WINDOW (onclick handlers in index.html & cards)
// ─────────────────────────────────────────────────────────────
Object.assign(window, {
  // Auth / login
  handleLogin,
  handleLogout,
  forgotPass,
  togglePwd,

  // Navigation — use patched versions
  filterCat:   filterCatPatched,
  runFilter:   runFilterPatched,
  filterGroup,          // ← new: Double A sub-folder
  showProducts,         // ← new: Products page
  openAIQA,             // ← new: AI Q&A direct link

  // Process cards
  secureOpen,

  // Admin
  showAdmin,
  openModal,
  closeModal,
  editUser,
  saveUser,
  deleteUserAct,
  onRoleChange,
  selectAllProcs,
});
