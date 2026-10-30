const ENQUIRY_URL = "https://script.google.com/macros/s/AKfycbzjlijGXaELu2FYQZifc08hsEJk8fBBbuq7a7gnmifw6olnQS0hyzpIcXOVlC2k5Q4/exec";

document.getElementById('enquiryForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var form = this;
  var btn = form.querySelector('button[type="submit"]');
  var msg = document.getElementById('enqMsg');
  var origBtnText = btn ? btn.innerText : 'Submit Enquiry';

  var enq = {
    source:       'website_enquiry',
    id:           Date.now(),
    name:         document.getElementById('enqName').value.trim(),
    whatsapp:     document.getElementById('enqWhatsApp').value.trim(),
    email:        document.getElementById('enqEmail').value.trim(),
    quantity:     document.getElementById('enqQty').value.trim(),
    requirements: document.getElementById('enqReq').value.trim(),
    status:       'new',
    date:         new Date().toISOString().slice(0, 10)
  };

  // 1. Local backup
  try {
    var list = JSON.parse(localStorage.getItem('sp_enq') || '[]');
    list.push(enq);
    localStorage.setItem('sp_enq', JSON.stringify(list));
  } catch(err) {}

  // 2. Submit to Google Sheet backend
  if (btn) {
    btn.disabled = true;
    btn.innerText = 'Submitting...';
  }

  fetch(ENQUIRY_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enq)
  })
  .then(function() {
    form.reset();
    if (msg) {
      msg.textContent = "Enquiry submitted! We'll get back to you soon.";
      msg.style.display = 'block';
    }
  })
  .catch(function(error) {
    console.error('Enquiry submission error:', error);
    if (msg) {
      msg.textContent = "Enquiry submitted! We'll get back to you soon.";
      msg.style.display = 'block';
    }
    form.reset();
  })
  .finally(function() {
    if (btn) {
      btn.disabled = false;
      btn.innerText = origBtnText;
    }
    setTimeout(function() {
      if (msg) msg.style.display = 'none';
    }, 5000);
  });
});


// Review form
document.getElementById('reviewForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var rev = {
    id: Date.now(),
    name:   document.getElementById('revName').value,
    text:   document.getElementById('revText').value,
    rating: parseInt(document.getElementById('revRating').value)||5,
    status: 'pending',
    date:   new Date().toISOString().slice(0,10)
  };
  var list = JSON.parse(localStorage.getItem('sp_rev') || '[]');
  list.push(rev);
  localStorage.setItem('sp_rev', JSON.stringify(list));

  document.getElementById('msg').style.display = 'block';
  this.reset();
  document.querySelectorAll('.star').forEach(s=>s.style.color='#ccc');
  setTimeout(()=>{ document.getElementById('msg').style.display='none'; }, 4000);
});
