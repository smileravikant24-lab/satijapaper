// === REVIEWS ===
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxuO_0hINdaD8OQBo25d1FxyNQTNZ7lq_aE8UwV06dWzEhvHphz0Fi-sA9QPjs3shR4/exec";
let selectedRating = 5;

function setupStars() {
  document.querySelectorAll('#star-input .star').forEach(function (s) {
    s.addEventListener('click', function () {
      selectedRating = this.getAttribute('data-val');
      updateStarUI(selectedRating);
    });
  });
}
function updateStarUI(r) {
  document.querySelectorAll('#star-input .star').forEach(function (s) {
    s.style.color = s.getAttribute('data-val') <= r ? "#C49A3C" : "#ccc";
  });
  document.getElementById('revRating').value = r;
}
function fetchReviews() {
  fetch(SCRIPT_URL).then(r => r.json()).then(function (data) {
    var c = document.getElementById('reviews-display');
    if (!data || !data.length) { c.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:var(--silver);">No reviews yet.</p>'; return; }
    c.innerHTML = data.reverse().slice(0, 6).map(function (r) {
      var sg = '\u2605'.repeat(r.rating || 5), sy = '\u2606'.repeat(5 - (r.rating || 5)), ts = '';
      if (r.date) { var d = new Date(r.date); ts = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
      return '<div class="product-card" style="padding:24px;"><div style="color:#C49A3C;margin-bottom:8px;font-size:1rem;">' + sg + '<span style="color:#ccc;">' + sy + '</span></div><h4 style="color:var(--emerald);margin-bottom:6px;font-size:1.1rem;">' + r.name + '</h4><p style="font-style:italic;font-size:0.92rem;color:var(--text-muted);">\u201c' + r.review + '\u201d</p>' + (ts ? '<p style="font-size:0.75rem;color:var(--silver);margin-top:10px;">' + ts + '</p>' : '') + '</div>';
    }).join('');
  }).catch(function (e) { console.log("Reviews error:", e); });
}

var reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
  reviewForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = e.target.querySelector('button'), msg = document.getElementById('msg');
    btn.innerText = "Sending..."; btn.disabled = true;
    fetch(SCRIPT_URL, {
      method: 'POST', mode: 'no-cors',
      body: JSON.stringify({
        name: document.getElementById('revName').value,
        review: document.getElementById('revText').value,
        rating: selectedRating,
        date: new Date().toISOString()
      })
    }).then(function () {
      reviewForm.reset(); selectedRating = 5; updateStarUI(5);
      msg.style.display = 'block'; btn.innerText = "Submit Review"; btn.disabled = false;
      setTimeout(function () { msg.style.display = 'none'; }, 5000);
    }).catch(function (err) { alert("Error: " + err); btn.disabled = false; });
  });
}
setupStars(); updateStarUI(5); fetchReviews();

// === ENQUIRY ===
var ENQUIRY_URL = "https://script.google.com/macros/s/AKfycbzaCQWDYTNfuSWBoMM1rD1GCjPv_6PM0nOtUadOYVSghGZsuVYiwx0fJo5vIA3ANzdWrg/exec";
var ef = document.getElementById('enquiryForm');
if (ef) {
  ef.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = e.target.querySelector('button'), msg = document.getElementById('enqMsg');
    btn.innerText = "Sending..."; btn.disabled = true;
    fetch(ENQUIRY_URL, {
      method: 'POST', mode: 'no-cors',
      body: JSON.stringify({
        name: document.getElementById('enqName').value,
        whatsapp: document.getElementById('enqWhatsApp').value,
        email: document.getElementById('enqEmail').value,
        quantity: document.getElementById('enqQty').value,
        requirements: document.getElementById('enqReq').value
      })
    }).then(function () {
      ef.reset(); msg.style.display = 'block';
      btn.innerText = "Submit Enquiry"; btn.disabled = false;
      setTimeout(function () { msg.style.display = 'none'; }, 5000);
    }).catch(function (err) { alert("Error: " + err); btn.innerText = "Submit Enquiry"; btn.disabled = false; });
  });
}
