/* ================================================================
   PEPIKA — CART PAGE JS  (js/cart-page.js)
   ================================================================ */
'use strict';

const VALID_COUPONS = {
  'PEPIKA10': { type:'percent', value:10, label:'10% off' },
  'SAVE5':    { type:'fixed',   value:5,  label:'€5 off'  },
  'FREESHIP': { type:'ship',    value:0,  label:'Free shipping' },
};

let appliedCoupon = null;

document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();

  /* Coupon apply */
  document.getElementById('apply-coupon')?.addEventListener('click', applyCoupon);
  document.getElementById('coupon-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') applyCoupon();
  });
});

/* ── RENDER FULL CART PAGE ────────────────────────────────── */
function renderCartPage() {
  const cart    = loadCart();
  const empty   = document.getElementById('cart-page-empty');
  const content = document.getElementById('cart-page-content');

  if (cart.length === 0) {
    if (empty)   empty.style.display   = '';
    if (content) content.style.display = 'none';
    return;
  }
  if (empty)   empty.style.display   = 'none';
  if (content) content.style.display = '';

  const container = document.getElementById('cart-page-items');
  if (!container) return;

  container.innerHTML = cart.map(item => `
    <div class="cart-page-item" data-id="${esc(item.id)}">
      <div class="cart-page-item-info">
        <img src="${esc(item.image || 'https://placehold.co/80x80/f3ede4/c06b3a?text=P')}"
             alt="${esc(item.name)}" class="cart-page-item-img">
        <div>
          <div class="cart-page-item-name">${esc(item.name)}</div>
          <div class="cart-page-item-meta">${esc(item.variant || '')}</div>
          <button class="btn btn-ghost btn-sm cart-page-remove" data-id="${esc(item.id)}" style="padding:0;margin-top:4px;font-size:var(--fs-xs);color:var(--c-error)">
            <i class="fa-solid fa-trash-can"></i> Remove
          </button>
        </div>
      </div>
      <div class="cart-page-item-price">${fmt(item.price)}</div>
      <div class="cart-page-qty">
        <button class="cpq-btn" data-action="dec" data-id="${esc(item.id)}" aria-label="Decrease">−</button>
        <span class="cpq-num">${item.qty}</span>
        <button class="cpq-btn" data-action="inc" data-id="${esc(item.id)}" aria-label="Increase">+</button>
      </div>
      <div class="cart-page-item-total">${fmt(item.price * item.qty)}</div>
      <button class="cart-page-remove" data-id="${esc(item.id)}" aria-label="Remove ${esc(item.name)}">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>`).join('');

  /* Qty buttons */
  container.querySelectorAll('.cpq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = loadCart(), it = c.find(i => i.id === btn.dataset.id);
      if (!it) return;
      const nq = btn.dataset.action === 'inc' ? it.qty + 1 : it.qty - 1;
      if (nq < 1) { cartRemove(btn.dataset.id); showToast('Item removed.'); }
      else        { cartSetQty(btn.dataset.id, nq); }
      renderCartPage(); updateTotals();
    });
  });

  /* Remove buttons */
  container.querySelectorAll('.cart-page-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      cartRemove(btn.dataset.id);
      showToast('Item removed.');
      renderCartPage(); updateTotals();
    });
  });

  updateTotals();
}

/* ── TOTALS ───────────────────────────────────────────────── */
function updateTotals() {
  const cart     = loadCart();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  let discount   = 0;

  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') discount = subtotal * appliedCoupon.value / 100;
    if (appliedCoupon.type === 'fixed')   discount = appliedCoupon.value;
  }

  const total = Math.max(0, subtotal - discount);

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('page-subtotal', fmt(subtotal));
  set('page-total',    fmt(total));

  const dl = document.getElementById('discount-line');
  if (dl) {
    dl.style.display = discount > 0 ? '' : 'none';
    set('discount-val', `−${fmt(discount)}`);
  }
}

/* ── COUPON ───────────────────────────────────────────────── */
function applyCoupon() {
  const input = document.getElementById('coupon-input');
  const msg   = document.getElementById('coupon-msg');
  if (!input || !msg) return;
  const code = input.value.trim().toUpperCase();
  const coupon = VALID_COUPONS[code];

  if (coupon) {
    appliedCoupon = coupon;
    msg.className = 'coupon-msg success';
    msg.innerHTML = `<i class="fa-solid fa-check"></i> Coupon applied: <strong>${coupon.label}</strong>`;
    showToast(`Coupon "${code}" applied!`);
  } else {
    appliedCoupon = null;
    msg.className = 'coupon-msg error';
    msg.innerHTML = `<i class="fa-solid fa-xmark"></i> Invalid coupon code.`;
  }
  updateTotals();
}

/* ── HELPERS (fallback if site.js not yet executed) ────────── */
function loadCart() {
  try { return JSON.parse(localStorage.getItem('pepika_cart_v2')) || []; } catch { return []; }
}
function fmt(n) { return `€${Number(n).toFixed(2)}`; }
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
