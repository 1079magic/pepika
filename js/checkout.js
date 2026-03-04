/* ================================================================
   PEPIKA — CHECKOUT PAGE JS  (js/checkout.js)
   ================================================================ */
'use strict';

let currentStep = 1;
const SHIPPING_PRICES = { standard:4.99, express:9.99, boxnow:2.99 };
let shipCost = 4.99;

document.addEventListener('DOMContentLoaded', () => {
  renderOrderSummary();

  /* Step navigation */
  document.getElementById('step1-next')?.addEventListener('click', () => {
    if (validateStep1()) goStep(2);
  });
  document.getElementById('step2-back')?.addEventListener('click', () => goStep(1));
  document.getElementById('step2-next')?.addEventListener('click', () => {
    if (validateStep2()) goStep(3);
  });
  document.getElementById('step3-back')?.addEventListener('click', () => goStep(2));
  document.getElementById('place-order')?.addEventListener('click', placeOrder);

  /* Shipping price update */
  document.querySelectorAll('input[name="shipping"]').forEach(r => {
    r.addEventListener('change', () => {
      shipCost = SHIPPING_PRICES[r.value] || 4.99;
      renderOrderSummary();
    });
  });

  /* Payment method toggle */
  document.querySelectorAll('input[name="payment"]').forEach(r => {
    r.addEventListener('change', () => {
      document.getElementById('card-fields').style.display   = r.value === 'card'   ? '' : 'none';
      document.getElementById('paypal-note').style.display   = r.value === 'paypal' ? '' : 'none';
      document.getElementById('bank-note').style.display     = r.value === 'bank'   ? '' : 'none';
    });
  });

  /* Card number formatting */
  document.getElementById('co-card-num')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g,'').slice(0,16);
    e.target.value = v.replace(/(.{4})/g,'$1 ').trim();
    const icon = document.getElementById('card-brand-icon');
    if (icon) {
      const first = v[0];
      icon.className = first === '4' ? 'fa-brands fa-cc-visa card-icon'
        : first === '5' ? 'fa-brands fa-cc-mastercard card-icon'
        : 'fa-brands fa-cc-visa card-icon';
    }
  });

  /* Expiry formatting */
  document.getElementById('co-expiry')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g,'');
    if (v.length >= 2) v = v.slice(0,2) + ' / ' + v.slice(2,4);
    e.target.value = v;
  });
});

/* ── STEP TRANSITIONS ─────────────────────────────────────── */
function goStep(n) {
  document.getElementById(`panel-${currentStep}`).style.display = 'none';
  document.getElementById(`panel-${n}`).style.display = '';

  document.querySelectorAll('.checkout-step').forEach(el => {
    const s = +el.dataset.step;
    el.classList.toggle('active', s === n);
    el.classList.toggle('done',   s < n);
  });

  currentStep = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── VALIDATION ───────────────────────────────────────────── */
function required(id) {
  const el = document.getElementById(id);
  const ok = el && el.value.trim() !== '';
  el?.closest('.field')?.classList.toggle('invalid', !ok);
  return ok;
}
function validEmail(id) {
  const el = document.getElementById(id);
  const ok = el && /\S+@\S+\.\S+/.test(el.value.trim());
  el?.closest('.field')?.classList.toggle('invalid', !ok);
  return ok;
}

function validateStep1() {
  const a = required('co-fname');
  const b = required('co-lname');
  const c = validEmail('co-email');
  const d = required('co-phone');
  return a && b && c && d;
}

function validateStep2() {
  const a = required('co-street');
  const b = required('co-city');
  const c = required('co-zip');
  return a && b && c;
}

function validateStep3() {
  const method = document.querySelector('input[name="payment"]:checked')?.value;
  if (method === 'card') {
    const a = required('co-card-name');
    const b = required('co-card-num');
    const c = required('co-expiry');
    const d = required('co-cvv');
    if (!(a && b && c && d)) return false;
  }
  if (!document.getElementById('co-terms')?.checked) {
    showToast('Please agree to the Terms & Conditions.', 'fa-triangle-exclamation', 'var(--c-error)');
    return false;
  }
  return true;
}

/* ── PLACE ORDER ──────────────────────────────────────────── */
function placeOrder() {
  if (!validateStep3()) return;

  const btn = document.getElementById('place-order');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing…'; }

  /* Simulate API call */
  setTimeout(() => {
    const orderNum = 'PEP-' + new Date().getFullYear() + '-' + Math.floor(Math.random()*9000+1000);
    document.getElementById('order-number').textContent = orderNum;
    document.getElementById('panel-3').style.display    = 'none';
    document.getElementById('order-success').style.display = '';
    document.getElementById('co-summary').style.display    = 'none';

    /* Mark all steps done */
    document.querySelectorAll('.checkout-step').forEach(el => el.classList.add('done'));

    cartClear();
    showToast('Order placed! Confirmation email sent. 🎉');

    /* In real site, call api.checkout({...}) here */
  }, 1800);
}

/* ── ORDER SUMMARY RENDER ─────────────────────────────────── */
function renderOrderSummary() {
  const cart = loadCart();
  const el   = document.getElementById('co-items');
  if (!el) return;

  el.innerHTML = cart.map(item => `
    <div class="co-item">
      <img src="${esc(item.image || 'https://placehold.co/52x52/f3ede4/c06b3a?text=P')}" alt="${esc(item.name)}">
      <div class="co-item-info">
        <strong>${esc(item.name)}</strong>
        <span>${esc(item.variant || '')} × ${item.qty}</span>
      </div>
      <span class="co-item-price">${fmt(item.price * item.qty)}</span>
    </div>`).join('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total    = subtotal + (subtotal >= 100 ? 0 : shipCost);

  const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  set('co-subtotal', fmt(subtotal));
  set('co-shipping', subtotal >= 100 ? 'FREE' : fmt(shipCost));
  set('co-total',    fmt(total));
}

/* ── HELPERS ──────────────────────────────────────────────── */
function loadCart() {
  try { return JSON.parse(localStorage.getItem('pepika_cart_v2')) || []; } catch { return []; }
}
function fmt(n) { return `€${Number(n).toFixed(2)}`; }
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
