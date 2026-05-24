
document.getElementById('enquiryForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var enq = {
    id: Date.now(),
    name:  document.getElementById('enqName').value,
    wa:    document.getElementById('enqWhatsApp').value,
    email: document.getElementById('enqEmail').value,
    qty:   document.getElementById('enqQty').value,
    req:   document.getElementById('enqReq').value,
    status:'new',
    date:  new Date().toISOString().slice(0,10)
  };
  var list = JSON.parse(localStorage.getItem('sp_enq') || '[]');
  list.push(enq);
  localStorage.setItem('sp_enq', JSON.stringify(list));

  document.getElementById('enqMsg').style.display = 'block';
  this.reset();
  setTimeout(()=>{ document.getElementById('enqMsg').style.display='none'; }, 4000);
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
