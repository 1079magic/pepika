/* ================================================================
   PEPIKA — INNER PAGES JS  (js/pages.js)
   Handles: cart page render · coupon · checkout wizard
            card formatting · contact form · FAQ accordion
            account auth · account dashboard · wishlist render
            password toggle · password strength
   ================================================================ */
'use strict';

/* ─── PAGE DETECTION ─────────────────────────────────────────── */
const page = location.pathname.split('/').pop();

document.addEventListener('DOMContentLoaded', () => {
  if (page === 'cart.html')     initCartPage();
  if (page === 'checkout.html') initCheckout();
  if (page === 'contact.html')  initContact();
  if (page === 'account.html')  initAccount();
});

/* ================================================================
   CART PAGE
   ================================================================ */
function initCartPage() {
  const COUPON_CODES = { PEPIKA10: 0.10, WELCOME5: 0.05, SUMMER15: 0.15 };
  let appliedDiscount = 0;
  let appliedCode     = '';

  function renderCartPage() {
    const cart       = loadCart();
    const itemsEl    = document.getElementById('cart-page-items');
    const emptyEl    = document.getElementById('cart-page-empty');
    const summaryBox = document.getElementById('cart-summary-box');
    const couponRow  = document.getElementById('coupon-row');
    if (!itemsEl) return;

    if (cart.length === 0) {
      itemsEl.innerHTML = '';
      if (emptyEl)    emptyEl.style.display = '';
      if (summaryBox) summaryBox.style.display = 'none';
      if (couponRow)  couponRow.style.display  = 'none';
      return;
    }

    if (emptyEl)    emptyEl.style.display = 'none';
    if (summaryBox) summaryBox.style.display = '';
    if (couponRow)  couponRow.style.display  = '';

    /* Build rows */
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-page-item" data-id="${esc(item.id)}">
        <div class="cart-page-item-info">
          <img class="cart-page-item-img"
               src="${esc(item.image || 'https://placehold.co/80x80/f3ede4/c06b3a?text=P')}"
               alt="${esc(item.name)}">
          <div>
            <div class="cart-page-item-name">${esc(item.name)}</div>
            <div class="cart-page-item-meta">${esc(item.variant || '')}</div>
            <a href="product.html" style="font-size:var(--fs-xs);color:var(--c-accent);text-decoration:underline">Edit</a>
          </div>
        </div>
        <div class="cart-page-item-price">${fmt(item.price)}</div>
        <div class="cart-page-qty">
          <button class="cpq-btn" data-action="dec" data-id="${esc(item.id)}" aria-label="−">−</button>
          <span class="cpq-num">${item.qty}</span>
          <button class="cpq-btn" data-action="inc" data-id="${esc(item.id)}" aria-label="+">+</button>
        </div>
        <div class="cart-page-item-total">${fmt(item.price * item.qty)}</div>
        <button class="cart-page-remove" data-id="${esc(item.id)}" aria-label="Remove ${esc(item.name)}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>`).join('');

    /* Bind qty buttons */
    document.querySelectorAll('.cpq-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const c  = loadCart();
        const it = c.find(i => i.id === btn.dataset.id);
        if (!it) return;
        const nq = btn.dataset.action === 'inc' ? it.qty + 1 : it.qty - 1;
        if (nq < 1) { cartRemove(btn.dataset.id); }
        else        { cartSetQty(btn.dataset.id, nq); }
        renderCartPage();
      });
    });

    /* Bind remove buttons */
    document.querySelectorAll('.cart-page-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        cartRemove(btn.dataset.id);
        showToast('Item removed from cart.');
        renderCartPage();
      });
    });

    updateSummary();
  }

  function updateSummary() {
    const cart   = loadCart();
    const sub    = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const count  = cart.reduce((s, i) => s + i.qty, 0);
    const disc   = sub * appliedDiscount;
    const ship   = sub - disc >= 100 ? 0 : 4.99;
    const total  = sub - disc + ship;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('cart-summary-count', count);
    set('cart-summary-sub',   fmt(sub));
    set('cart-shipping-val',  ship === 0 ? 'FREE' : fmt(ship));
    set('cart-summary-total', fmt(total));

    const dLine = document.getElementById('discount-line');
    if (dLine) dLine.style.display = appliedDiscount > 0 ? '' : 'none';
    const dAmt  = document.getElementById('discount-amount');
    if (dAmt) dAmt.textContent = `−${fmt(disc)}`;
    const dLbl  = document.getElementById('discount-code-label');
    if (dLbl) dLbl.textContent = appliedCode;
  }

  /* Coupon logic */
  document.getElementById('coupon-btn')?.addEventListener('click', () => {
    const inp = document.getElementById('coupon-input');
    const msg = document.getElementById('coupon-msg');
    const code = inp?.value.trim().toUpperCase();
    if (!code) return;
    const pct = COUPON_CODES[code];
    if (pct) {
      appliedDiscount = pct;
      appliedCode     = code;
      inp.value       = '';
      if (msg) { msg.textContent = `✓ Code "${code}" applied — ${pct * 100}% off!`; msg.className = 'coupon-msg success'; }
      showToast(`Code "${code}" applied!`);
      updateSummary();
    } else {
      if (msg) { msg.textContent = `✗ Code "${code}" is invalid or expired.`; msg.className = 'coupon-msg error'; }
    }
  });

  renderCartPage();
}

/* ================================================================
   CHECKOUT
   ================================================================ */
function initCheckout() {
  let currentStep = 1;
  let shippingCost = 4.99;
  const FREE_THRESHOLD = 100;

  /* Populate order summary */
  function renderCoSummary() {
    const cart  = loadCart();
    const list  = document.getElementById('co-items-list');
    if (list) {
      list.innerHTML = cart.map(item => `
        <div class="co-item">
          <img src="${esc(item.image || 'https://placehold.co/52x52/f3ede4/c06b3a?text=P')}" alt="${esc(item.name)}">
          <div class="co-item-info">
            <strong>${esc(item.name)}</strong>
            ${esc(item.variant || '')} × ${item.qty}
          </div>
          <span class="co-item-price">${fmt(item.price * item.qty)}</span>
        </div>`).join('');
    }
    updateCoTotals();
  }

  function updateCoTotals() {
    const cart = loadCart();
    const sub  = cart.reduce((s, i) => s + i.price * i.qty, 0);
    shippingCost = sub >= FREE_THRESHOLD ? 0 : shippingCost;
    const total = sub + shippingCost;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('co-sub',      fmt(sub));
    set('co-ship-val', shippingCost === 0 ? 'FREE' : fmt(shippingCost));
    set('co-total',    fmt(total));
  }

  /* Update shipping cost when method changes */
  document.querySelectorAll('[name="shipping"]').forEach(r => {
    r.addEventListener('change', () => {
      const priceEl = r.closest('.ship-option')?.querySelector('.ship-price');
      shippingCost  = parseFloat(priceEl?.dataset.price || 4.99);
      updateCoTotals();
    });
  });

  /* Step navigation */
  function goToStep(n) {
    document.querySelectorAll('.checkout-panel[id^="co-step-"]').forEach(p => p.style.display = 'none');
    const panel = document.getElementById(`co-step-${n}`);
    if (panel) panel.style.display = '';

    document.querySelectorAll('.checkout-step').forEach(s => {
      const sn = +s.dataset.step;
      s.classList.toggle('active', sn === n);
      s.classList.toggle('done',   sn < n);
    });

    currentStep = n;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* Validate step 1 fields */
  function validateStep1() {
    const required = ['co-email', 'co-fname', 'co-lname', 'co-addr', 'co-city', 'co-zip', 'co-country'];
    let ok = true;
    required.forEach(id => {
      const inp = document.getElementById(id);
      const fld = inp?.closest('.field');
      const val = inp?.value.trim();
      fld?.classList.remove('invalid');
      if (!val || (id === 'co-email' && !val.includes('@'))) {
        fld?.classList.add('invalid'); ok = false;
      }
    });
    return ok;
  }

  document.getElementById('co-step1-next')?.addEventListener('click', () => {
    if (!validateStep1()) {
      showToast('Please fill in all required fields.', 'fa-triangle-exclamation', 'var(--c-error)');
      return;
    }
    /* Update address preview */
    const fname  = document.getElementById('co-fname')?.value || '';
    const lname  = document.getElementById('co-lname')?.value || '';
    const addr   = document.getElementById('co-addr')?.value  || '';
    const city   = document.getElementById('co-city')?.value  || '';
    const zip    = document.getElementById('co-zip')?.value   || '';
    const country= document.getElementById('co-country')?.value || '';
    const prev   = document.getElementById('co-address-preview');
    if (prev) prev.textContent = `${fname} ${lname}, ${addr}, ${zip} ${city}, ${country}`;
    goToStep(2);
  });

  document.getElementById('co-step2-next')?.addEventListener('click', () => goToStep(3));
  document.getElementById('co-step2-back')?.addEventListener('click', () => goToStep(1));
  document.getElementById('co-step3-back')?.addEventListener('click', () => goToStep(2));
  document.getElementById('edit-address-btn')?.addEventListener('click', () => goToStep(1));

  /* Payment method switch */
  document.querySelectorAll('[name="payment"]').forEach(r => {
    r.addEventListener('change', () => {
      const cardF   = document.getElementById('card-fields');
      const ppNote  = document.getElementById('paypal-note');
      const bankNote= document.getElementById('bank-note');
      if (cardF)    cardF.style.display    = r.value === 'card'   ? '' : 'none';
      if (ppNote)   ppNote.style.display   = r.value === 'paypal' ? '' : 'none';
      if (bankNote) bankNote.style.display = r.value === 'bank'   ? '' : 'none';
    });
  });

  /* Card number formatting */
  document.getElementById('cc-num')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 16);
    e.target.value = v.match(/.{1,4}/g)?.join(' ') || v;
  });

  /* Card expiry formatting */
  document.getElementById('cc-exp')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + ' / ' + v.slice(2);
    e.target.value = v;
  });

  /* Place order */
  document.getElementById('co-place-order')?.addEventListener('click', () => {
    const terms = document.getElementById('co-terms');
    if (!terms?.checked) {
      showToast('Please agree to terms & conditions.', 'fa-triangle-exclamation', 'var(--c-error)');
      return;
    }

    /* Validate card if selected */
    const payMethod = document.querySelector('[name="payment"]:checked')?.value;
    if (payMethod === 'card') {
      const ccName = document.getElementById('cc-name')?.value.trim();
      const ccNum  = document.getElementById('cc-num')?.value.replace(/\s/g, '');
      const ccExp  = document.getElementById('cc-exp')?.value.trim();
      const ccCvv  = document.getElementById('cc-cvv')?.value.trim();
      if (!ccName || ccNum.length < 16 || !ccExp || ccCvv.length < 3) {
        showToast('Please complete all card fields.', 'fa-triangle-exclamation', 'var(--c-error)');
        return;
      }
    }

    /* Simulate order placement */
    const btn = document.getElementById('co-place-order');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing…'; }

    setTimeout(() => {
      const orderNum = 'PEP-' + Math.floor(10000 + Math.random() * 90000);
      const numEl = document.getElementById('order-number');
      if (numEl) numEl.textContent = orderNum;

      /* Show success */
      document.querySelectorAll('.checkout-panel').forEach(p => p.style.display = 'none');
      document.getElementById('co-success').style.display = '';
      document.getElementById('checkout-steps').style.display = 'none';

      /* Clear cart */
      cartClear();

      api.checkout({ order: orderNum, payment: payMethod });
    }, 1800);
  });

  renderCoSummary();
  goToStep(1);
}

/* ================================================================
   CONTACT FORM
   ================================================================ */
function initContact() {
  /* FAQ accordion */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* Contact form */
  document.getElementById('contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('ct-name');
    const email   = document.getElementById('ct-email');
    const subject = document.getElementById('ct-subject');
    const message = document.getElementById('ct-message');
    const consent = document.getElementById('ct-consent');
    let valid = true;

    [name, email, subject, message].forEach(inp => inp?.closest('.field')?.classList.remove('invalid'));

    if (!name?.value.trim())               { name?.closest('.field')?.classList.add('invalid'); valid = false; }
    if (!email?.value.includes('@'))       { email?.closest('.field')?.classList.add('invalid'); valid = false; }
    if (!subject?.value)                   { subject?.closest('.field')?.classList.add('invalid'); valid = false; }
    if (!message?.value.trim())            { message?.closest('.field')?.classList.add('invalid'); valid = false; }
    if (!consent?.checked) {
      showToast('Please accept the privacy policy.', 'fa-triangle-exclamation', 'var(--c-error)');
      valid = false;
    }

    if (!valid) return;

    const btn = e.target.querySelector('[type="submit"]');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…'; }

    setTimeout(() => {
      document.getElementById('contact-success').style.display = '';
      e.target.reset();
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message'; }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  });
}

/* ================================================================
   ACCOUNT
   ================================================================ */
function initAccount() {
  const AUTH_KEY  = 'pepika_auth_v1';
  const isLogged  = () => !!localStorage.getItem(AUTH_KEY);
  const authBox   = document.getElementById('auth-box');
  const dashboard = document.getElementById('dashboard');

  function showDashboard(user) {
    if (authBox)   authBox.style.display   = 'none';
    if (dashboard) dashboard.style.display = '';
    const av = user.name?.[0]?.toUpperCase() || 'U';
    const el = document.getElementById('acct-avatar');
    if (el) el.textContent = av;
    const nm = document.getElementById('acct-name');
    if (nm) nm.textContent = user.name || 'Customer';
    const em = document.getElementById('acct-email');
    if (em) em.textContent = user.email || '';
  }

  function showAuth() {
    if (authBox)   authBox.style.display   = '';
    if (dashboard) dashboard.style.display = 'none';
  }

  /* Initial state */
  const savedUser = (() => { try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; } })();
  if (savedUser) showDashboard(savedUser); else showAuth();

  /* AUTH TABS */
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const which = tab.dataset.auth;
      document.getElementById('auth-login').style.display    = which === 'login'    ? '' : 'none';
      document.getElementById('auth-register').style.display = which === 'register' ? '' : 'none';
    });
  });

  /* PASSWORD TOGGLES */
  document.querySelectorAll('.pw-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const inp = document.getElementById(btn.dataset.target);
      if (!inp) return;
      const show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      const icon = btn.querySelector('i');
      if (icon) icon.className = show ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
    });
  });

  /* PASSWORD STRENGTH */
  document.getElementById('r-pw')?.addEventListener('input', e => {
    const v   = e.target.value;
    const bar = document.getElementById('pw-bar');
    if (!bar) return;
    let score = 0;
    if (v.length >= 8)            score++;
    if (/[A-Z]/.test(v))          score++;
    if (/[0-9]/.test(v))          score++;
    if (/[^A-Za-z0-9]/.test(v))   score++;
    const colours = ['', '#e05252', '#d4a843', '#3a9e6a', '#3d7a52'];
    const widths  = ['0%', '25%', '50%', '75%', '100%'];
    bar.style.width      = widths[score];
    bar.style.background = colours[score];
  });

  /* LOGIN FORM */
  document.getElementById('login-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('l-email')?.value.trim();
    const pw    = document.getElementById('l-pw')?.value;
    let ok = true;
    if (!email?.includes('@')) {
      document.getElementById('l-email')?.closest('.field')?.classList.add('invalid'); ok = false;
    }
    if (!pw) {
      document.getElementById('l-pw')?.closest('.field')?.classList.add('invalid'); ok = false;
    }
    if (!ok) return;

    const btn = e.target.querySelector('[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }

    setTimeout(() => {
      const user = { name: email.split('@')[0], email };
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      showToast(`Welcome back, ${user.name}!`);
      showDashboard(user);
      if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; }
    }, 900);
  });

  /* REGISTER FORM */
  document.getElementById('register-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const fname = document.getElementById('r-fname')?.value.trim();
    const lname = document.getElementById('r-lname')?.value.trim();
    const email = document.getElementById('r-email')?.value.trim();
    const pw    = document.getElementById('r-pw')?.value;
    const terms = document.getElementById('r-terms');
    let ok = true;

    ['r-fname','r-lname','r-email','r-pw'].forEach(id => {
      document.getElementById(id)?.closest('.field')?.classList.remove('invalid');
    });

    if (!fname) { document.getElementById('r-fname')?.closest('.field')?.classList.add('invalid'); ok = false; }
    if (!lname) { document.getElementById('r-lname')?.closest('.field')?.classList.add('invalid'); ok = false; }
    if (!email?.includes('@')) { document.getElementById('r-email')?.closest('.field')?.classList.add('invalid'); ok = false; }
    if (!pw || pw.length < 8)  { document.getElementById('r-pw')?.closest('.field')?.classList.add('invalid'); ok = false; }
    if (!terms?.checked) { showToast('Please agree to the Terms.', 'fa-triangle-exclamation', 'var(--c-error)'); ok = false; }
    if (!ok) return;

    const btn = e.target.querySelector('[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Creating account…'; }

    setTimeout(() => {
      const user = { name: `${fname} ${lname}`, email };
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      showToast(`Welcome, ${fname}!`);
      showDashboard(user);
      if (btn) { btn.disabled = false; btn.textContent = 'Create Account'; }
    }, 900);
  });

  /* LOGOUT */
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem(AUTH_KEY);
    showToast('Signed out successfully.', 'fa-arrow-right-from-bracket', 'var(--c-text-muted)');
    showAuth();
  });

  /* DASHBOARD MENU SECTIONS */
  document.querySelectorAll('.acct-menu-btn[data-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.acct-menu-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.acct-section').forEach(s => s.style.display = 'none');
      const section = document.getElementById(`sec-${btn.dataset.section}`);
      if (section) section.style.display = '';
      if (btn.dataset.section === 'wishlist') renderWishlist();
    });
  });

  /* WISHLIST RENDER */
  function renderWishlist() {
    const grid  = document.getElementById('wishlist-grid');
    const empty = document.getElementById('wishlist-empty');
    const wish  = loadWish();
    if (!grid) return;

    if (wish.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.style.display = '';
      return;
    }
    if (empty) empty.style.display = 'none';

    /* Build basic cards from wish IDs (in a real app you'd fetch product data) */
    grid.innerHTML = wish.map(id => `
      <div class="p-card">
        <div class="p-card-img">
          <img src="https://placehold.co/300x400/f3ede4/c06b3a?text=${encodeURIComponent(id)}" alt="${esc(id)}" loading="lazy">
          <button class="p-card-wish active" data-wish-id="${esc(id)}" aria-pressed="true"><i class="fa-solid fa-heart"></i></button>
          <div class="p-card-actions">
            <a href="product.html" class="btn btn-dark btn-sm" style="flex:1">View</a>
            <button class="btn btn-primary btn-sm" onclick="quickAdd('${esc(id)}','${esc(id)}',49.99)"><i class="fa-solid fa-bag-shopping"></i></button>
          </div>
        </div>
        <div class="p-card-body">
          <div class="p-card-cat">Personalised Products</div>
          <div class="p-card-name"><a href="product.html">${esc(id)}</a></div>
          <div class="p-card-price">€49.99</div>
        </div>
      </div>`).join('');
  }

  /* PROFILE FORM */
  document.getElementById('profile-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const fname = document.getElementById('pf-fname')?.value.trim();
    const email = document.getElementById('pf-email')?.value.trim();
    if (fname && email) {
      const user = { name: fname, email };
      localStorage.setItem('pepika_auth_v1', JSON.stringify(user));
      const nm = document.getElementById('acct-name');
      if (nm) nm.textContent = fname;
      const av = document.getElementById('acct-avatar');
      if (av) av.textContent = fname[0].toUpperCase();
    }
    showToast('Profile updated!');
  });

  /* Check hash for deep-link to wishlist */
  if (location.hash === '#wishlist' && isLogged()) {
    document.querySelector('[data-section="wishlist"]')?.click();
  }
}

/* ─── LOCAL HELPERS (mirror site.js if pages.js loads alone) ── */
function loadCart() { try { return JSON.parse(localStorage.getItem('pepika_cart_v2')) || []; } catch { return []; } }
function loadWish()  { try { return JSON.parse(localStorage.getItem('pepika_wish_v1'))  || []; } catch { return []; } }
function fmt(n)  { return `€${Number(n).toFixed(2)}`; }
function esc(s)  { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
