// === PRODUCT CARD IMAGE FIX ===
function fixCardImages() {
  document.querySelectorAll('.rpl-card-img').forEach(function(c) {
    c.style.height = '300px';
    c.style.display = 'flex';
    c.style.alignItems = 'center';
    c.style.justifyContent = 'center';
    c.style.overflow = 'hidden';
    var img = c.querySelector('img');
    if (img) {
      img.style.height = '100%';
      img.style.width = 'auto';
      img.style.maxWidth = '100%';
    }
  });
}
document.addEventListener('DOMContentLoaded', fixCardImages);

// === LOADER ===
window.addEventListener('load', function () {
  setTimeout(function () { document.getElementById('pageLoader').classList.add('hide'); }, 700);
  setTimeout(function () { document.getElementById('pageLoader').style.display = 'none'; }, 1400);
});

// === SCROLL TOP & NAV SHRINK ===
window.addEventListener('scroll', function () {
  var b = document.getElementById('scrollTopBtn');
  if (window.scrollY > 400) b.classList.add('visible'); else b.classList.remove('visible');
  var n = document.querySelector('nav');
  if (window.scrollY > 70) n.classList.add('scrolled'); else n.classList.remove('scrolled');
  revealOnScroll();
});

// === PARTICLES ===
(function () {
  var c = document.getElementById('heroParticles'); if (!c) return;
  for (var i = 0; i < 18; i++) {
    var p = document.createElement('div'); p.className = 'h-particle';
    var s = Math.random() * 8 + 3;
    p.style.width = s + 'px'; p.style.height = s + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + 40 + '%';
    p.style.animationDuration = (Math.random() * 10 + 7) + 's';
    p.style.animationDelay = Math.random() * 6 + 's';
    c.appendChild(p);
  }
})();

// === SCROLL REVEAL ===
function revealOnScroll() {
  document.querySelectorAll('.sr,.sr-left,.sr-right,.sr-scale').forEach(function (el) {
    if (el.getBoundingClientRect().top < window.innerHeight - 50) el.classList.add('show');
  });
}
window.addEventListener('load', function () { setTimeout(revealOnScroll, 80); });

// === MOBILE MENU ===
function toggleMenu() {
  var n = document.getElementById('navLinks'), t = document.getElementById('menuToggle'), o = document.getElementById('mobileOverlay');
  n.classList.toggle('mobile-active'); t.classList.toggle('active');
  if (n.classList.contains('mobile-active')) { o.classList.add('active'); document.body.style.overflow = 'hidden'; }
  else { o.classList.remove('active'); document.body.style.overflow = ''; }
}
function closeMenu() {
  document.getElementById('navLinks').classList.remove('mobile-active');
  document.getElementById('menuToggle').classList.remove('active');
  document.getElementById('mobileOverlay').classList.remove('active');
  document.body.style.overflow = '';
}
function toggleDropdownMobile(e, id) {
  if (window.innerWidth <= 768) {
    e.preventDefault(); e.stopPropagation();
    document.querySelectorAll('.dropdown-menu').forEach(function (d) { if (d.id !== id) d.classList.remove('mobile-open'); });
    document.getElementById(id).classList.toggle('mobile-open');
  }
}

function showPage(id) {
  document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-links a').forEach(function (l) { l.classList.remove('active'); });
  document.getElementById(id).classList.add('active');
  var link = document.getElementById('link-' + id);
  if (link) link.classList.add('active');
  if (id === 'photos' || id === 'videos') document.getElementById('link-media').classList.add('active');
  if (id.startsWith('brand-')) document.getElementById('link-products').classList.add('active');
  closeMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(revealOnScroll, 200);
  setTimeout(fixCardImages, 100);
}

// === GALLERY ===
var galleryImages = [
  { src: 'doublea.jpg', caption: 'Double A' }, { src: 'satia.jpg', caption: 'Satia' },
  { src: 'ruchira.jpg', caption: 'Ruchira' }, { src: 'khanna.jpg', caption: 'Khanna' },
  { src: 'nra.jpg', caption: 'NR Agarwal' }, { src: 'andhra.jpg', caption: 'Andhra Paper' }
];
var currentLightboxIndex = 0;
function openLightbox(i) {
  currentLightboxIndex = i;
  document.getElementById('lightbox-img').src = galleryImages[i].src;
  document.getElementById('lightbox-caption').textContent = galleryImages[i].caption;
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(e) {
  if (e.target.classList.contains('lightbox') || e.target.classList.contains('lightbox-close')) {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
  }
}
function navigateLightbox(e, d) {
  e.stopPropagation();
  currentLightboxIndex += d;
  if (currentLightboxIndex < 0) currentLightboxIndex = galleryImages.length - 1;
  if (currentLightboxIndex >= galleryImages.length) currentLightboxIndex = 0;
  document.getElementById('lightbox-img').src = galleryImages[currentLightboxIndex].src;
  document.getElementById('lightbox-caption').textContent = galleryImages[currentLightboxIndex].caption;
}
document.addEventListener('keydown', function (e) {
  var lb = document.getElementById('lightbox');
  if (!lb.classList.contains('active')) return;
  if (e.key === 'Escape') { lb.classList.remove('active'); document.body.style.overflow = ''; }
  if (e.key === 'ArrowLeft') navigateLightbox(e, -1);
  if (e.key === 'ArrowRight') navigateLightbox(e, 1);
});

// === SLIDESHOW ===
var slideIndex = 0;
function showSlides() {
  var s = document.getElementsByClassName("mySlides"),
    cap = document.getElementById("slide-caption"),
    labels = ["Double A", "Satia Industries", "Ruchira Papers", "Khanna Paper", "N R Agarwal", "Andhra Paper"];
  for (var i = 0; i < s.length; i++) s[i].style.display = "none";
  slideIndex++;
  if (slideIndex > s.length) slideIndex = 1;
  s[slideIndex - 1].style.display = "block";
  cap.innerHTML = labels[slideIndex - 1];
  setTimeout(showSlides, 3000);
}
showSlides();

// === VIDEO POPUP ===
function openVideoPopup(src) {
  var p = document.getElementById('videoPopup');
  var content = document.getElementById('videoPopupContent');
  
  // Check karein ki link YouTube ka hai ya normal file ka
  if (src.includes('youtube.com') || src.includes('youtu.be')) {
    // YouTube ke liye iframe generator
    content.innerHTML = '<iframe src="' + src + '?autoplay=1" style="width:100%;height:100%;border:none;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
  } else {
    // Normal MP4 files (jaise doublea.mp4) ke liye purana tarika
    content.innerHTML = '<video src="' + src + '" style="width:100%;height:100%;background:#000;" controls autoplay></video>';
  }
  
  p.style.display = 'flex'; 
  document.body.style.overflow = 'hidden';
}
function closeVideoPopup(e) {
  if (e.target.id === 'videoPopup' || e.target.classList.contains('video-popup-close')) {
    document.getElementById('videoPopupContent').innerHTML = '';
    document.getElementById('videoPopup').style.display = 'none';
    document.body.style.overflow = '';
  }
}

// === SHARE POPUP STYLES ===
(function _injectShareCSS() {
  var css = '' +
    '.sp-share-overlay{position:fixed;inset:0;background:rgba(0,0,0,.52);z-index:99999;' +
    'display:flex;align-items:center;justify-content:center;padding:16px;' +
    'opacity:0;transition:opacity .22s;pointer-events:none;}' +
    '.sp-share-overlay.active{opacity:1;pointer-events:all;}' +
    '.sp-share-box{background:#fff;border-radius:22px;' +
    'box-shadow:0 24px 64px rgba(0,0,0,.22);width:100%;max-width:400px;' +
    'padding:28px 28px 24px;position:relative;' +
    'transform:translateY(24px) scale(.97);transition:transform .25s cubic-bezier(.34,1.56,.64,1);}' +
    '.sp-share-overlay.active .sp-share-box{transform:translateY(0) scale(1);}' +
    '.sp-share-close{position:absolute;top:14px;right:16px;background:none;border:none;' +
    'cursor:pointer;color:#718096;font-size:22px;padding:4px 8px;' +
    'border-radius:8px;transition:background .15s;line-height:1;}' +
    '.sp-share-close:hover{background:rgba(0,0,0,.06);}' +
    '.sp-share-title{font-size:15px;font-weight:800;color:#1a202c;' +
    'margin-bottom:4px;padding-right:32px;line-height:1.3;}' +
    '.sp-share-sub{font-size:12px;color:#718096;margin-bottom:20px;font-weight:500;}' +
    '.sp-share-apps{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:22px;}' +
    '.sp-share-app{display:flex;flex-direction:column;align-items:center;gap:7px;' +
    'cursor:pointer;border:none;background:none;padding:0;}' +
    '.sp-share-app-icon{width:52px;height:52px;border-radius:14px;display:flex;' +
    'align-items:center;justify-content:center;color:#fff;' +
    'transition:transform .15s,box-shadow .15s;}' +
    '.sp-share-app:hover .sp-share-app-icon{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.18);}' +
    '.sp-share-app-label{font-size:10.5px;font-weight:700;color:#718096;letter-spacing:.2px;}' +
    '.sp-share-app-icon.wa{background:linear-gradient(135deg,#25d366,#128c7e);}' +
    '.sp-share-app-icon.tg{background:linear-gradient(135deg,#2AABEE,#229ED9);}' +
    '.sp-share-app-icon.sms{background:linear-gradient(135deg,#3b82f6,#1d4ed8);}' +
    '.sp-share-app-icon.mail{background:linear-gradient(135deg,#f59e0b,#d97706);}' +
    '.sp-share-app-icon.copy{background:linear-gradient(135deg,#6366f1,#4338ca);}' +
    '.sp-share-app-icon.dl{background:linear-gradient(135deg,#10b981,#059669);}' +
    '.sp-share-link-row{display:flex;gap:8px;align-items:center;}' +
    '.sp-share-link-input{flex:1;border:1.5px solid #e2e8f0;border-radius:10px;' +
    'padding:9px 12px;font-size:11.5px;color:#1a202c;background:#f7fafc;' +
    'font-family:inherit;font-weight:600;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}' +
    '.sp-share-copy-btn{padding:9px 16px;background:#4f46e5;color:#fff;' +
    'border:none;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;' +
    'white-space:nowrap;transition:background .15s;}' +
    '.sp-share-copy-btn:hover{background:#4338ca;}' +
    '.sp-share-copy-btn.copied{background:#16a34a;}' +
    '.sp-share-toast{font-size:11px;color:#16a34a;font-weight:700;text-align:center;margin-top:10px;height:16px;}' +
    '@media(max-width:420px){.sp-share-apps{grid-template-columns:repeat(3,1fr);gap:10px;}.sp-share-box{padding:22px 18px 18px;}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();

// === PRODUCT CARD SHARE POPUP ===
var _spShareLabel = '';
var _spShareCardId = '';
var _spShareMsg = '';
var _spShareLink = 'https://www.satijapaper.com';

function _loadH2C() {
  if (window.html2canvas) return Promise.resolve();
  return new Promise(function(resolve, reject) {
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    s.onload = resolve;
    s.onerror = function() { reject(new Error('html2canvas failed to load')); };
    document.head.appendChild(s);
  });
}

function shareProductCard(cardId, label) {
  _spShareCardId = cardId;
  _spShareLabel = label;
  _spShareMsg = label + ' | Satija Paper — www.satijapaper.com';
  _spShareLink = 'https://www.satijapaper.com';
  document.getElementById('spShareTitle').textContent = 'Share — ' + label;
  document.getElementById('spShareLinkInput').value = _spShareLink;
  document.getElementById('spShareToast').textContent = '';
  var btn = document.getElementById('spShareCopyBtn');
  btn.textContent = 'Copy'; btn.classList.remove('copied');
  var ov = document.getElementById('spShareOverlay');
  ov.style.display = 'flex';
  requestAnimationFrame(function() { ov.classList.add('active'); });
}

function spShareHide() {
  var ov = document.getElementById('spShareOverlay');
  ov.classList.remove('active');
  setTimeout(function() { ov.style.display = 'none'; }, 240);
}

function spShareVia(app) {
  var text = encodeURIComponent(_spShareMsg);
  var url = encodeURIComponent(_spShareLink);
  if (app === 'whatsapp') {
    window.open('https://wa.me/?text=' + text, '_blank');
  } else if (app === 'telegram') {
    window.open('https://t.me/share/url?url=' + url + '&text=' + text, '_blank');
  } else if (app === 'sms') {
    window.open('sms:?body=' + text, '_blank');
  } else if (app === 'email') {
    window.open('mailto:?subject=' + encodeURIComponent('Satija Paper – ' + _spShareLabel) + '&body=' + text, '_blank');
  } else if (app === 'copy') {
    spShareCopyLink();
    return;
  } else if (app === 'download') {
    spShareDownloadCard();
    return;
  }
}

function spShareCopyLink() {
  navigator.clipboard.writeText(_spShareMsg + '\n' + _spShareLink).then(function() {
    var btn = document.getElementById('spShareCopyBtn');
    var toast = document.getElementById('spShareToast');
    btn.textContent = 'Copied!'; btn.classList.add('copied');
    toast.textContent = '✓ Copied to clipboard';
    setTimeout(function() { btn.textContent = 'Copy'; btn.classList.remove('copied'); toast.textContent = ''; }, 2500);
  });
}

async function spShareDownloadCard() {
  var el = document.getElementById(_spShareCardId);
  if (!el) return;
  var toast = document.getElementById('spShareToast');
  toast.textContent = '⏳ Preparing image...';
  try {
    await _loadH2C();
    var shareButtons = el.querySelectorAll('.rpl-share-btn');
    shareButtons.forEach(function(b) { b.style.display = 'none'; });
    var canvas = await html2canvas(el, {
      useCORS: true, allowTaint: true, backgroundColor: '#ffffff',
      scale: 2, logging: false, imageTimeout: 12000
    });
    shareButtons.forEach(function(b) { b.style.display = ''; });
    var blob = await new Promise(function(resolve) { canvas.toBlob(resolve, 'image/png', 0.95); });
    var fileName = _spShareLabel.replace(/[^a-z0-9]/gi, '_') + '_SatijaPaper.png';
    var urlObj = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = urlObj; a.download = fileName; a.click();
    URL.revokeObjectURL(urlObj);
    toast.textContent = '✓ Image downloaded!';
    setTimeout(function() { toast.textContent = ''; }, 2500);
  } catch(err) {
    console.error('Download error:', err);
    toast.textContent = 'Download failed';
    setTimeout(function() { toast.textContent = ''; }, 2500);
  }
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var ov = document.getElementById('spShareOverlay');
    if (ov && ov.classList.contains('active')) spShareHide();
  }
});

// === SECURITY ===
document.addEventListener("contextmenu", function (e) { e.preventDefault(); });
document.onkeydown = function (e) {
  if (e.keyCode == 123) return false;
  if (e.ctrlKey && e.shiftKey && e.keyCode == 73) return false;
  if (e.ctrlKey && e.keyCode == 85) return false;
};
