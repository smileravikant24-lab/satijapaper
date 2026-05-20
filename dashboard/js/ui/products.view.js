// =============================================================
// PRODUCTS VIEW – renders the paper brand / product catalogue
// =============================================================

import { PRODUCTS } from '../data.js';

/**
 * Render the full Products catalogue page.
 * Call this instead of renderCards() when cat === 'Products'.
 * @param {HTMLElement} container  The #cardBox element
 */
export function renderProducts(container) {
  container.innerHTML = '';
  container.style.display = 'block';   // override grid layout

  const wrap = document.createElement('div');
  wrap.className = 'products-wrap';
  wrap.innerHTML = PRODUCTS.map(brand => buildBrandCard(brand)).join('');
  container.appendChild(wrap);
}

function buildBrandCard(brand) {
  const certs = brand.cert.map(c => `<span class="prod-cert">${c}</span>`).join('');
  const variants = brand.variants.map(v => buildVariant(v, brand)).join('');

  return `
  <div class="prod-brand-card" id="prod-${brand.id}">
    <div class="prod-brand-header">
      <div class="prod-brand-img-wrap">
        <img src="${brand.img}" alt="${brand.name}" class="prod-brand-img"
             onerror="this.onerror=null;this.src='https://via.placeholder.com/120x80?text=${encodeURIComponent(brand.name)}'">
      </div>
      <div class="prod-brand-meta">
        <h3 class="prod-brand-name">${brand.fullName || brand.name}</h3>
        <div class="prod-brand-origin"><i class="fas fa-location-dot"></i> ${brand.origin}</div>
        <p class="prod-brand-tagline">${brand.tagline}</p>
        <div class="prod-cert-row">${certs}</div>
      </div>
      <div class="prod-enquire-wrap">
        <a href="https://www.satijapaper.com/#enquiry" target="_blank" class="prod-enquire-btn">
          <i class="fas fa-envelope"></i> Enquire
        </a>
      </div>
    </div>
    <div class="prod-variants-grid">${variants}</div>
  </div>`;
}

function buildVariant(v, brand) {
  const sizes = v.sizes.map(s => `<span class="prod-size-pill">${s}</span>`).join('');
  // Use product-specific image if available (Double A), else brand image
  const img = (brand.productImg && brand.productImg[v.gsm]) ? brand.productImg[v.gsm] : brand.img;
  const extras = [
    v.cie       ? `<div class="prod-spec"><span>CIE</span><strong>${v.cie}</strong></div>` : '',
    v.opacity   ? `<div class="prod-spec"><span>Opacity</span><strong>${v.opacity}</strong></div>` : '',
    v.thickness ? `<div class="prod-spec"><span>Thickness</span><strong>${v.thickness}</strong></div>` : '',
    v.sheets    ? `<div class="prod-spec"><span>Sheets/Ream</span><strong>${v.sheets}</strong></div>` : '',
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
