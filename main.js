// === LOADER ===
window.addEventListener('load', function () {
  setTimeout(function () { document.getElementById('pageLoader').classList.add('hide'); }, 700);
  setTimeout(function () { document.getElementById('pageLoader').style.display = 'none'; }, 1400);
});

// === DARK MODE ===
function toggleDarkMode() {
  var h = document.documentElement;
  h.setAttribute('data-theme', h.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  localStorage.setItem('theme', h.getAttribute('data-theme'));
}
(function () { var s = localStorage.getItem('theme'); if (s) document.documentElement.setAttribute('data-theme', s); })();

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

// === SECURITY ===
document.addEventListener("contextmenu", function (e) { e.preventDefault(); });
document.onkeydown = function (e) {
  if (e.keyCode == 123) return false;
  if (e.ctrlKey && e.shiftKey && e.keyCode == 73) return false;
  if (e.ctrlKey && e.keyCode == 85) return false;
};
