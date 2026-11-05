/**
 * Dynamic Dashboard Layout Template
 * Renders the internal dashboard only after authenticated session is confirmed.
 */

export function getDashboardHTML() {
  return `
  <!-- ── TOP NAV BAR ────────────────────────────────────── -->
  <header class="top-nav">
    <a href="https://www.satijapaper.com" target="_blank" class="top-brand">
      <img src="logo.png" alt="SP" class="top-brand-logo"
           onerror="this.src='https://via.placeholder.com/36x36?text=SP'">
      <div class="top-brand-name">SATIJA PAPER</div>
    </a>

    <div class="top-status-pill" title="Real-time systems synchronization active">
      <div class="status-radar-dot"></div>
      <span>Live Systems Active</span>
    </div>

    <div class="top-search" id="searchWrap">
      <i class="fas fa-magnifying-glass top-search-icon"></i>
      <input type="text" class="top-search-input" placeholder="Search processes, sheets, forms… (Ctrl+K)"
             id="searchInput" oninput="runFilter()" onclick="handleSearchClick(event)">
      <span class="search-k-badge" title="Press Ctrl+K to launch Command Palette">⌘K / Ctrl+K</span>
    </div>

    <div class="top-actions">
      <!-- Dark/Light Theme Switcher -->
      <button class="top-theme-btn" id="themeToggleBtn" onclick="toggleDashboardTheme()" title="Toggle Dark / Light Theme">
        <i class="fas fa-moon" id="themeIcon"></i>
      </button>

      <!-- User Profile Strip -->
      <div class="top-user">
        <div class="top-avatar" id="sAvatar">
          A
          <div class="top-avatar-online" title="Online"></div>
        </div>
        <div class="top-uinfo">
          <div class="top-uname" id="sName">Admin</div>
          <div class="top-urole" id="sRole">Admin</div>
        </div>
        <button class="top-logout" onclick="handleLogout()" title="Logout">
          <i class="fas fa-right-from-bracket"></i>
        </button>
      </div>
    </div>
  </header>

  <div class="app-body">

  <!-- ── SIDEBAR NAV ───────────────────────────────────────── -->
  <nav class="tab-row">
    <button class="tab-btn active" id="navAll" title="All Processes" onclick="filterCat('All',this)">
      <i class="fas fa-grid-2"></i>
      <span class="tab-label">All Processes</span>
      <span class="tab-count" id="cntAll">0</span>
    </button>

    <div class="nav-group-title">Core Operations</div>

    <button class="tab-btn" id="navImport" title="Import & Procurement" onclick="filterCat('Import',this)">
      <i class="fas fa-ship"></i>
      <span class="tab-label">Import & Procurement</span>
      <span class="tab-count" id="cntImport">0</span>
    </button>
    <button class="tab-btn" id="navSales" title="Sales & Marketing" onclick="filterCat('Sales',this)">
      <i class="fas fa-chart-line"></i>
      <span class="tab-label">Sales & Marketing</span>
      <span class="tab-count" id="cntSales">0</span>
    </button>
    <button class="tab-btn tab-btn-sub" id="navDoubleA" title="Double A" style="display:none" onclick="filterCat('DoubleA',this)">
      <i class="fas fa-award"></i>
      <span class="tab-label">Double A</span>
      <span class="tab-count" id="cntDoubleA">0</span>
    </button>
    <button class="tab-btn" id="navWarehouse" title="Warehouse & Logistics" onclick="filterCat('Warehouse',this)">
      <i class="fas fa-warehouse"></i>
      <span class="tab-label">Warehouse & Logistics</span>
      <span class="tab-count" id="cntWarehouse">0</span>
    </button>
    <button class="tab-btn" id="navPurchase" title="Purchase & Inventory" onclick="filterCat('Purchase',this)">
      <i class="fas fa-cart-shopping"></i>
      <span class="tab-label">Purchase & Inventory</span>
      <span class="tab-count" id="cntPurchase">0</span>
    </button>

    <div class="nav-group-title">Finance & Management</div>

    <button class="tab-btn" id="navAccounts" title="Accounts, GST & Tax" onclick="filterCat('Accounts',this)">
      <i class="fas fa-calculator"></i>
      <span class="tab-label">Accounts, GST & Tax</span>
      <span class="tab-count" id="cntAccounts">0</span>
    </button>
    <button class="tab-btn" id="navAdminMIS" title="Admin & MIS" onclick="filterCat('AdminMIS',this)">
      <i class="fas fa-clipboard-check"></i>
      <span class="tab-label">Admin & MIS</span>
      <span class="tab-count" id="cntAdminMIS">0</span>
    </button>
    <button class="tab-btn" id="navSupport" title="Team / Support" onclick="filterCat('Support',this)">
      <i class="fas fa-headset"></i>
      <span class="tab-label">Team / Support</span>
      <span class="tab-count" id="cntSupport">0</span>
    </button>

    <div class="nav-group-title">Enterprise Assets</div>

    <button class="tab-btn" id="navFamily" title="SP Family" onclick="filterCat('Family',this)">
      <i class="fas fa-folder-heart"></i>
      <span class="tab-label">SP Family</span>
      <span class="tab-count" id="cntFamily">0</span>
    </button>
    <button class="tab-btn" id="navProducts" title="Products" onclick="showProducts(this)">
      <i class="fas fa-cubes"></i>
      <span class="tab-label">Products</span>
      <span class="tab-count products-badge" id="cntProducts">9</span>
    </button>
    <button class="tab-btn" id="navBankDetails" title="Bank Details" onclick="showBankDetails(this)">
      <i class="fas fa-landmark"></i>
      <span class="tab-label">Bank Details</span>
    </button>
    <button class="tab-btn" id="navGallery" title="Gallery" onclick="showGallery(this)">
      <i class="fas fa-images"></i>
      <span class="tab-label">Gallery</span>
    </button>

    <!-- Sales Dashboard (hidden by default, shown for Sales/Admin users) -->
    <div class="tab-sep" id="salesDashSep" style="display:none"></div>
    <button class="tab-btn" id="navSalesDash" title="Sales Dashboard" style="display:none"
            onclick="showSalesDashboard(this)">
      <i class="fas fa-chart-bar"></i>
      <span class="tab-label">Sales Dashboard</span>
    </button>

    <!-- Admin-only (hidden by default, shown by sidebar.view.js) -->
    <div class="tab-sep" id="adminNavLabel" style="display:none"></div>
    <button class="tab-btn tab-btn-admin" id="adminNavBtn" title="Admin" style="display:none"
            onclick="showAdmin(this)">
      <i class="fas fa-user-gear"></i>
      <span class="tab-label">Admin Control</span>
    </button>
  </nav>

  <!-- ── MAIN CONTENT ───────────────────────────────────── -->
  <div class="main-content">
    <div class="content">

      <!-- Executive Mission Control Hero Ribbon -->
      <div class="exec-hero" id="execHero">
        <div class="exec-hero-top">
          <div class="exec-greeting">
            <h2>
              <span>Welcome back,</span>
              <span id="heroUserName" style="color:var(--accent)">Team</span>
              <span style="font-size:14px">👋</span>
            </h2>
            <p>
              <span>Satija Paper HQ Mission Control</span>
              <span>•</span>
              <span class="exec-time-chip" id="heroTimeChip">
                <i class="far fa-clock"></i> <span id="heroLiveClock">--:-- IST</span>
              </span>
            </p>
          </div>
          <div class="exec-quick-links">
            <a href="https://order.satijapaper.com" target="_blank" rel="noopener" class="exec-chip-btn" title="Open Order Form">
              <i class="fas fa-file-invoice"></i> Order Form
            </a>
            <button onclick="filterCat('Sales')" class="exec-chip-btn" title="View Sales Processes">
              <i class="fas fa-chart-line"></i> Sales
            </button>
            <button onclick="filterCat('Purchase')" class="exec-chip-btn" title="View Purchase Processes">
              <i class="fas fa-warehouse"></i> Inventory
            </button>
            <button onclick="openAIQA()" class="exec-chip-btn" style="background:linear-gradient(135deg,rgba(16,185,129,0.15),rgba(5,150,105,0.25));color:var(--ok);border-color:rgba(16,185,129,0.3)" title="Open AI Command Center">
              <i class="fas fa-robot"></i> AI Assistant
            </button>
          </div>
        </div>

        <!-- Pinned Processes Tray -->
        <div class="pinned-tray" id="pinnedTray" style="display:none">
          <div class="pinned-label"><i class="fas fa-star" style="color:#f59e0b"></i> Pinned Shortcuts:</div>
          <div id="pinnedList" style="display:flex;gap:6px;flex-wrap:wrap"></div>
        </div>
      </div>

      <h2 class="page-title" id="pageHeader">All Processes</h2>

      <!-- Company Profile Banner -->
      <div id="cpBanner" style="display:none"></div>

      <!-- Process card grid -->
      <div class="grid" id="cardBox"></div>

      <!-- Personal bank accounts -->
      <div id="personalBankPanel" style="display:none"></div>

      <!-- Products catalogue -->
      <div id="productsPanel" style="display:none"></div>

      <!-- Sales Dashboard -->
      <div id="salesPanel" style="display:none"></div>

      <!-- Admin panel -->
      <div class="admin-panel" id="adminPanel">
        <div class="admin-top">
          <h3>
            <i class="fas fa-users-gear" style="margin-right:8px;color:var(--accent)"></i>
            User Management
          </h3>
          <button class="add-btn" onclick="openModal()">
            <i class="fas fa-plus"></i> Add User
          </button>
        </div>
        <div class="info-box">
          <i class="fas fa-info-circle"></i>
          <strong>New user workflow:</strong> Add user here → Create user in Firebase Auth with same email.
        </div>
        <div class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>Email</th><th>Display Name</th><th>Role</th>
                <th>Dept Access</th><th>Process Access</th><th>Actions</th>
              </tr>
            </thead>
            <tbody id="tblBody"></tbody>
          </table>
        </div>
      </div>

    </div><!-- /content -->
  </div><!-- /main-content -->

  </div><!-- /app-body -->
  `;
}

export function getModalsHTML() {
  return `
<!-- ── RAYCAST / LINEAR STYLE COMMAND PALETTE ─────────────── -->
<div class="cmd-backdrop" id="cmdBackdrop" onclick="closeCmdPaletteOnBackdrop(event)">
  <div class="cmd-box" onclick="event.stopPropagation()">
    <div class="cmd-input-wrap">
      <i class="fas fa-magnifying-glass"></i>
      <input type="text" class="cmd-input" id="cmdInput" placeholder="Type to search any process, sheet, form or person…" oninput="onCmdInput(this.value)">
      <span class="cmd-esc-badge">ESC</span>
    </div>
    <div class="cmd-filters" id="cmdFilters">
      <button class="cmd-filter-pill active" onclick="setCmdCategory('All', this)">All</button>
      <button class="cmd-filter-pill" onclick="setCmdCategory('Sales', this)">Sales</button>
      <button class="cmd-filter-pill" onclick="setCmdCategory('Purchase', this)">Purchase</button>
      <button class="cmd-filter-pill" onclick="setCmdCategory('Warehouse', this)">Warehouse</button>
      <button class="cmd-filter-pill" onclick="setCmdCategory('Accounts', this)">Accounts</button>
      <button class="cmd-filter-pill" onclick="setCmdCategory('Double A', this)">Double A</button>
      <button class="cmd-filter-pill" onclick="setCmdCategory('Products', this)">Products</button>
    </div>
    <div class="cmd-list" id="cmdList">
      <!-- Populated dynamically -->
    </div>
    <div class="cmd-footer">
      <span>Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate, <kbd>Enter</kbd> to open</span>
      <span>Press <kbd>ESC</kbd> to exit</span>
    </div>
  </div>
</div>

<div class="modal-bg" id="userModal">
  <div class="modal-box">
    <div class="modal-head">
      <h3 id="modalTitle">Add / Edit User Profile</h3>
      <button class="modal-x" onclick="closeModal()"><i class="fas fa-xmark"></i></button>
    </div>
    <div class="modal-body">
      <input type="hidden" id="editUserId">
      <div class="mf">
        <label>Display Name</label>
        <input type="text" id="mName" placeholder="e.g. Neha Sharma">
      </div>
      <div class="mf">
        <label>Email</label>
        <input type="email" id="mUser" placeholder="user@satijapaper.com">
      </div>
      <div class="mf">
        <label>Role</label>
        <select id="mRole" onchange="onRoleChange()">
          <option value="Team Member">Team Member</option>
          <option value="Admin">Admin</option>
        </select>
      </div>
      <div id="accessSection">
        <hr class="section-divider">
        <div class="proc-section-head">
          <i class="fas fa-sitemap"></i> Access Permissions
        </div>

        <div class="access-mode-note" id="accessModeNote" style="display:none">
          <i class="fas fa-info-circle"></i> Individual processes selected — overrides dept access.
        </div>
        <div id="procField">
          <div class="proc-sel-actions">
            <button class="proc-sel-btn" onclick="selectAllProcs(true)">
              <i class="fas fa-check-double"></i> Select All
            </button>
            <button class="proc-sel-btn" onclick="selectAllProcs(false)">
              <i class="fas fa-xmark"></i> Clear All
            </button>
          </div>
          <div id="procListContainer"></div>
        </div>
      </div>
    </div>
    <div class="modal-foot">
      <button class="mbtn sec" onclick="closeModal()">Cancel</button>
      <button class="mbtn pri" onclick="saveUser()">
        <i class="fas fa-save"></i> Save
      </button>
    </div>
  </div>
</div>

<!-- Image Lightbox -->
<div id="imgLightbox" onclick="closeImgLightbox()" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;align-items:center;justify-content:center;cursor:zoom-out;">
  <img id="imgLightboxImg" src="" alt="" style="max-width:92vw;max-height:92vh;border-radius:10px;box-shadow:0 8px 40px rgba(0,0,0,.6);object-fit:contain;">
</div>
`;
}

export function openImgLightbox(src){
  const lb = document.getElementById('imgLightbox');
  const img = document.getElementById('imgLightboxImg');
  if (lb && img) {
    img.src = src;
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

export function closeImgLightbox(){
  const lb = document.getElementById('imgLightbox');
  const img = document.getElementById('imgLightboxImg');
  if (lb && img) {
    lb.style.display = 'none';
    img.src = '';
    document.body.style.overflow = '';
  }
}

let _lightboxListenerBound = false;

export function mountDashboardLayout() {
  const app = document.getElementById('appContainer');
  if (app && !app.hasChildNodes()) {
    app.innerHTML = getDashboardHTML();
  }
  const modals = document.getElementById('modalContainer');
  if (modals && !modals.hasChildNodes()) {
    modals.innerHTML = getModalsHTML();
  }

  if (!_lightboxListenerBound) {
    _lightboxListenerBound = true;
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeImgLightbox();
    });
  }
}

export function unmountDashboardLayout() {
  const app = document.getElementById('appContainer');
  if (app) {
    app.innerHTML = '';
    app.classList.remove('visible');
  }
  const modals = document.getElementById('modalContainer');
  if (modals) {
    modals.innerHTML = '';
  }
}
