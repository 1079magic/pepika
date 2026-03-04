/* ================================================================
   PEPIKA — GLOBAL SITE ENGINE  (js/site.js)
   Handles: header scroll · mobile nav · search bar · cart state
            cart drawer render · wishlist · toast · scroll reveal
            newsletter · footer year · API placeholders
   ================================================================ */
'use strict';

/* ─── TINY UTILITIES ────────────────────────────────────────── */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const fmt = n => `€${Number(n).toFixed(2)}`;
const esc = s => String(s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;')
  .replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/* ─── TOAST ─────────────────────────────────────────────────── */
function showToast(msg, icon = 'fa-circle-check', colour = 'var(--c-success)') {
  const t = $('#toast'), m = $('#toast-msg');
  if (!t) return;
  t.querySelector('i').className = `fa-solid ${icon}`;
  t.querySelector('i').style.color = colour;
  m.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), 3200);
}
window.showToast = showToast;

/* ─── LOCAL-STORAGE HELPERS ─────────────────────────────────── */
const CART_KEY = 'pepika_cart_v2';
const WISH_KEY = 'pepika_wish_v1';

const loadCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } };
const saveCart = c  => localStorage.setItem(CART_KEY, JSON.stringify(c));
const loadWish = () => { try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; } catch { return []; } };
const saveWish = w  => localStorage.setItem(WISH_KEY, JSON.stringify(w));

const cartTotal = c => c.reduce((s, i) => s + i.price * i.qty, 0);
const cartCount = c => c.reduce((s, i) => s + i.qty, 0);

/* ─── CART CRUD ─────────────────────────────────────────────── */
window.cartAdd = function(item) {
  const c = loadCart();
  const ex = c.find(i => i.id === item.id);
  ex ? (ex.qty += item.qty) : c.push({ ...item });
  saveCart(c);
  renderCartDrawer();
  updateBadges();
  return c;
};

window.cartRemove = function(id) {
  saveCart(loadCart().filter(i => i.id !== id));
  renderCartDrawer(); updateBadges();
};

window.cartSetQty = function(id, qty) {
  const c = loadCart(), it = c.find(i => i.id === id);
  if (it) { it.qty = Math.max(1, qty); saveCart(c); renderCartDrawer(); updateBadges(); }
};

window.cartClear = function() { saveCart([]); renderCartDrawer(); updateBadges(); };

/* ─── WISHLIST CRUD ─────────────────────────────────────────── */
window.wishToggle = function(id, name = 'Item') {
  const w = loadWish(), idx = w.indexOf(id);
  if (idx > -1) {
    w.splice(idx, 1);
    showToast('Removed from wishlist.', 'fa-heart-crack', '#e05252');
  } else {
    w.push(id);
    showToast(`"${name}" saved to wishlist ♥`, 'fa-heart', '#e05252');
  }
  saveWish(w);
  updateWishBtns();
  updateBadges();
};
window.isWished = id => loadWish().includes(id);

function updateWishBtns() {
  $$('[data-wish-id]').forEach(btn => {
    const wished = isWished(btn.dataset.wishId);
    btn.classList.toggle('active', wished);
    const icon = btn.querySelector('i');
    if (icon) icon.className = wished ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    btn.setAttribute('aria-pressed', String(wished));
  });
}

/* ─── RENDER CART DRAWER ────────────────────────────────────── */
function renderCartDrawer() {
  const body  = $('#cart-body');
  const foot  = $('#cart-foot');
  const empty = $('#cart-empty');
  if (!body) return;

  const cart  = loadCart();

  if (cart.length === 0) {
    if (empty) empty.style.display = '';
    if (foot)  foot.style.display  = 'none';
    return;
  }
  if (empty) empty.style.display = 'none';
  if (foot)  foot.style.display  = '';

  /* Build items HTML */
  body.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${esc(item.id)}">
      <img src="${esc(item.image || 'https://placehold.co/68x68/f3ede4/c06b3a?text=P')}"
           alt="${esc(item.name)}" class="cart-item-img">
      <div class="cart-item-info">
        <div class="cart-item-name">${esc(item.name)}</div>
        <div class="cart-item-meta">${esc(item.variant || '')}</div>
        <div class="cart-item-qty-row">
          <button class="cart-item-qty-btn" data-action="dec" data-id="${esc(item.id)}" aria-label="−">−</button>
          <span class="cart-item-qty-num">${item.qty}</span>
          <button class="cart-item-qty-btn" data-action="inc" data-id="${esc(item.id)}" aria-label="+">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:var(--sp-2)">
        <span class="cart-item-price">${fmt(item.price * item.qty)}</span>
        <button class="cart-item-remove" data-id="${esc(item.id)}" aria-label="Remove ${esc(item.name)}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>`).join('');

  /* Bind qty / remove buttons */
  $$('.cart-item-qty-btn', body).forEach(b => {
    b.addEventListener('click', () => {
      const c2 = loadCart(), it = c2.find(i => i.id === b.dataset.id);
      if (!it) return;
      const newQty = b.dataset.action === 'inc' ? it.qty + 1 : it.qty - 1;
      if (newQty < 1) cartRemove(b.dataset.id);
      else cartSetQty(b.dataset.id, newQty);
    });
  });
  $$('.cart-item-remove', body).forEach(b => {
    b.addEventListener('click', () => { cartRemove(b.dataset.id); showToast('Item removed.'); });
  });

  /* Totals */
  const total  = cartTotal(cart);
  const count  = cartCount(cart);
  const FREE   = 100;
  const remain = Math.max(0, FREE - total);
  const pct    = Math.min(100, (total / FREE) * 100);

  const set = (id, val) => { const el = $(`#${id}`); if (el) el.textContent = val; };
  set('cart-subtotal-val',  fmt(total));
  set('cart-total-val',     fmt(total));
  set('cart-item-count',    count);
  const fill = $('#free-ship-fill'); if (fill) fill.style.width = `${pct}%`;
  const msg  = $('#free-ship-msg');
  if (msg) {
    msg.innerHTML = remain > 0
      ? `Add <strong>${fmt(remain)}</strong> more for free shipping!`
      : `<span style="color:var(--c-success)">🎉 You qualify for free shipping!</span>`;
  }
}

/* ─── BADGES ────────────────────────────────────────────────── */
function updateBadges() {
  const cart  = loadCart();
  const wish  = loadWish();
  const cartN = cartCount(cart);
  const wishN = wish.length;

  const cb = $('#cart-badge');
  if (cb) { cb.textContent = cartN; cb.classList.toggle('show', cartN > 0); }

  const wb = $('#wish-badge');
  if (wb) { wb.textContent = wishN; wb.classList.toggle('show', wishN > 0); }
}

/* ─── CART DRAWER OPEN / CLOSE ──────────────────────────────── */
function openCart() {
  renderCartDrawer();
  $('#cart-drawer')?.classList.add('open');
  $('#cart-drawer')?.setAttribute('aria-hidden', 'false');
  $('#cart-overlay')?.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  $('#cart-drawer')?.classList.remove('open');
  $('#cart-drawer')?.setAttribute('aria-hidden', 'true');
  $('#cart-overlay')?.classList.remove('show');
  document.body.style.overflow = '';
}
window.openCart  = openCart;
window.closeCart = closeCart;

/* ─── HEADER SCROLL SHADOW ──────────────────────────────────── */
function initHeader() {
  const h = $('#site-header');
  if (!h) return;
  window.addEventListener('scroll', () => h.classList.toggle('scrolled', scrollY > 10), { passive:true });
}

/* ─── MOBILE NAV ────────────────────────────────────────────── */
function initMobileNav() {
  const burger = $('#hamburger'), nav = $('#site-nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  /* Mobile: tap nav-link with dropdown toggles it */
  $$('.nav-item', nav).forEach(item => {
    item.querySelector('.nav-link')?.addEventListener('click', e => {
      if (window.innerWidth <= 900 && item.querySelector('.nav-dropdown')) {
        e.preventDefault();
        item.classList.toggle('open');
      }
    });
  });

  /* Close on link click */
  $$('.nav-dropdown a', nav).forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ─── SEARCH BAR ────────────────────────────────────────────── */
function initSearch() {
  const toggle = $('#search-toggle'), bar = $('#search-bar'),
        close  = $('#search-close'),  inp = $('#search-input');
  if (!toggle || !bar) return;

  toggle.addEventListener('click', () => {
    const open = bar.classList.toggle('open');
    if (open) inp?.focus();
  });
  close?.addEventListener('click', () => bar.classList.remove('open'));

  inp?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = inp.value.trim();
      if (q) window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
    }
  });
}

/* ─── CART DRAWER INIT ──────────────────────────────────────── */
function initCartDrawer() {
  $('#cart-toggle')?.addEventListener('click', openCart);
  $('#cart-close')?.addEventListener('click', closeCart);
  $('#cart-overlay')?.addEventListener('click', closeCart);
  $('#cart-keep-shopping')?.addEventListener('click', closeCart);
}

/* ─── SCROLL REVEAL ─────────────────────────────────────────── */
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    $$('.reveal').forEach(el => el.classList.add('revealed'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => obs.observe(el));
}

/* ─── NEWSLETTER FOOTER ─────────────────────────────────────── */
function initNewsletter() {
  $$('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const inp = form.querySelector('input[type="email"]');
      if (!inp?.value.includes('@')) {
        showToast('Please enter a valid email.', 'fa-triangle-exclamation', 'var(--c-error)');
        return;
      }
      showToast('Subscribed! Welcome to Pepika 🎉');
      inp.value = '';
      api.subscribe(inp.value);
    });
  });
}

/* ─── FOOTER YEAR ───────────────────────────────────────────── */
function initFooterYear() {
  $$('.footer-year').forEach(el => el.textContent = new Date().getFullYear());
}

/* ─── ACTIVE NAV HIGHLIGHT ──────────────────────────────────── */
function initActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === path) a.classList.add('active');
  });
}

/* ─── WISHLIST BUTTON CLICK DELEGATION ─────────────────────── */
function initWishButtons() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-wish-id]');
    if (!btn) return;
    const id   = btn.dataset.wishId;
    const name = btn.closest('.p-card')?.querySelector('.p-card-name')?.textContent.trim() || 'Item';
    wishToggle(id, name);
  });
}

/* ─── QUICK ADD (called from onclick in product cards) ──────── */
window.quickAdd = function(id, name, price) {
  cartAdd({
    id, name, variant: 'Standard', qty: 1, price,
    image: `https://placehold.co/68x68/f3ede4/c06b3a?text=${encodeURIComponent(name.slice(0,2))}`,
  });
  showToast(`"${name}" added to cart!`);
  openCart();
};

/* ─── API PLACEHOLDER LAYER ─────────────────────────────────── */
/*
  Replace these stubs with real WooCommerce / Shopify / custom API calls.

  WooCommerce REST API:  https://woocommerce.github.io/woocommerce-rest-api-docs/
  Shopify Storefront:    https://shopify.dev/docs/api/storefront
*/
window.api = {
  addToCart:    async item    => console.log('[API] addToCart', item),
  removeCart:   async id      => console.log('[API] removeCart', id),
  checkout:     async data    => console.log('[API] checkout', data),
  submitReview: async review  => console.log('[API] submitReview', review),
  subscribe:    async email   => console.log('[API] subscribe', email),
  getProducts:  async params  => { console.log('[API] getProducts', params); return []; },
};

/* ─── INIT ALL ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initSearch();
  initCartDrawer();
  initReveal();
  initNewsletter();
  initFooterYear();
  initActiveNav();
  initWishButtons();
  updateBadges();
  updateWishBtns();
  renderCartDrawer();
  console.log('✅ Pepika engine ready.');
});
