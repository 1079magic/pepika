/* ================================================================
   PEPIKA — ACCOUNT PAGE JS  (js/account.js)
   ================================================================ */
'use strict';

const SESSION_KEY = 'pepika_session_v1';

document.addEventListener('DOMContentLoaded', () => {

  /* Check if already "logged in" (demo uses sessionStorage) */
  const session = loadSession();
  if (session) showDashboard(session);
  else         showAuth();

  /* Hash routing: account.html#wishlist → open wishlist panel */
  if (location.hash === '#wishlist' && loadSession()) {
    switchSection('wishlist');
  }

  /* ── AUTH TABS ────────────────────────────────────────────── */
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const which = tab.dataset.auth;
      document.getElementById('auth-login').style.display    = which === 'login'    ? '' : 'none';
      document.getElementById('auth-register').style.display = which === 'register' ? '' : 'none';
    });
  });

  /* ── TOGGLE PASSWORD VISIBILITY ───────────────────────────── */
  ['toggle-login-pw', 'toggle-reg-pw'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      const inputId = id === 'toggle-login-pw' ? 'login-pw' : 'reg-pw';
      const input   = document.getElementById(inputId);
      const icon    = document.getElementById(id)?.querySelector('i');
      if (!input) return;
      const show = input.type === 'password';
      input.type  = show ? 'text' : 'password';
      if (icon) icon.className = show ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
    });
  });

  /* ── PASSWORD STRENGTH ────────────────────────────────────── */
  document.getElementById('reg-pw')?.addEventListener('input', e => {
    const v   = e.target.value;
    const bar = document.getElementById('pw-bar');
    if (!bar) return;
    let strength = 0;
    if (v.length >= 8)  strength++;
    if (/[A-Z]/.test(v)) strength++;
    if (/[0-9]/.test(v)) strength++;
    if (/[^A-Za-z0-9]/.test(v)) strength++;
    const colours = ['','var(--c-error)','#e8a020','#6bba75','var(--c-success)'];
    bar.style.width      = `${strength * 25}%`;
    bar.style.background = colours[strength] || colours[1];
  });

  /* ── LOGIN FORM ───────────────────────────────────────────── */
  document.getElementById('login-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('login-email');
    const pw    = document.getElementById('login-pw');
    let ok = true;
    email?.closest('.field')?.classList.remove('invalid');
    pw?.closest('.field')?.classList.remove('invalid');
    if (!email?.value.match(/\S+@\S+\.\S+/)) { email?.closest('.field')?.classList.add('invalid'); ok = false; }
    if (!pw?.value.trim())                    { pw?.closest('.field')?.classList.add('invalid');    ok = false; }
    if (!ok) return;

    /* Demo login — accept any credentials */
    const session = { name: 'Marko Kovač', email: email.value, initial: email.value[0].toUpperCase() };
    saveSession(session);
    showDashboard(session);
    showToast('Welcome back! 👋');
  });

  /* ── REGISTER FORM ────────────────────────────────────────── */
  document.getElementById('register-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const fname  = document.getElementById('reg-fname');
    const lname  = document.getElementById('reg-lname');
    const email  = document.getElementById('reg-email');
    const pw     = document.getElementById('reg-pw');
    const terms  = document.getElementById('reg-terms');
    let ok = true;
    [fname, lname, email, pw].forEach(f => f?.closest('.field')?.classList.remove('invalid'));
    if (!fname?.value.trim()) { fname?.closest('.field')?.classList.add('invalid'); ok = false; }
    if (!lname?.value.trim()) { lname?.closest('.field')?.classList.add('invalid'); ok = false; }
    if (!email?.value.match(/\S+@\S+\.\S+/)) { email?.closest('.field')?.classList.add('invalid'); ok = false; }
    if ((pw?.value || '').length < 8)         { pw?.closest('.field')?.classList.add('invalid');    ok = false; }
    if (!terms?.checked) { showToast('Please accept the terms.', 'fa-triangle-exclamation', 'var(--c-error)'); ok = false; }
    if (!ok) return;

    const fullName = `${fname.value.trim()} ${lname.value.trim()}`;
    const session  = { name: fullName, email: email.value, initial: fname.value[0].toUpperCase() };
    saveSession(session);
    showDashboard(session);
    showToast(`Account created! Welcome, ${fname.value} 🎉`);
  });

  /* ── DASHBOARD SECTION NAV ────────────────────────────────── */
  document.querySelectorAll('.acct-menu-btn[data-section]').forEach(btn => {
    btn.addEventListener('click', () => switchSection(btn.dataset.section));
  });

  /* ── LOGOUT ───────────────────────────────────────────────── */
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    clearSession();
    showAuth();
    showToast('Signed out successfully.');
  });

  /* ── PROFILE FORM ─────────────────────────────────────────── */
  document.getElementById('profile-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const fname = document.getElementById('pf-fname')?.value.trim();
    const lname = document.getElementById('pf-lname')?.value.trim();
    const email = document.getElementById('pf-email')?.value.trim();
    const session = loadSession();
    if (session && fname && lname) {
      session.name    = `${fname} ${lname}`;
      session.email   = email;
      session.initial = fname[0].toUpperCase();
      saveSession(session);
      document.getElementById('acct-name').textContent         = session.name;
      document.getElementById('acct-email-label').textContent  = session.email;
      document.getElementById('acct-avatar').textContent       = session.initial;
    }
    showToast('Profile saved!');
  });

});

/* ── SECTION SWITCHING ────────────────────────────────────── */
function switchSection(name) {
  document.querySelectorAll('.acct-section').forEach(s => s.style.display = 'none');
  document.querySelectorAll('.acct-menu-btn').forEach(b => b.classList.remove('active'));
  const sec = document.getElementById(`section-${name}`);
  if (sec) sec.style.display = '';
  const btn = document.querySelector(`.acct-menu-btn[data-section="${name}"]`);
  if (btn) btn.classList.add('active');

  if (name === 'wishlist') renderWishlist();
}

/* ── WISHLIST RENDER ──────────────────────────────────────── */
function renderWishlist() {
  const wish = loadWish();
  const grid = document.getElementById('wishlist-grid');
  const empty= document.getElementById('wishlist-empty');
  if (!grid) return;

  if (wish.length === 0) {
    if (empty) empty.style.display = '';
    return;
  }
  if (empty) empty.style.display = 'none';

  /* Demo: render placeholder cards for each saved ID */
  const existing = grid.querySelectorAll('.p-card');
  existing.forEach(c => c.remove());

  wish.forEach(id => {
    const card = document.createElement('article');
    card.className = 'p-card';
    card.innerHTML = `
      <div class="p-card-img">
        <img src="https://placehold.co/400x533/f3ede4/c06b3a?text=${encodeURIComponent(id)}" alt="${esc(id)}" loading="lazy">
        <button class="p-card-wish active" data-wish-id="${esc(id)}" aria-pressed="true"><i class="fa-solid fa-heart"></i></button>
        <div class="p-card-actions">
          <a href="product.html" class="btn btn-dark btn-sm" style="flex:1">View Product</a>
        </div>
      </div>
      <div class="p-card-body">
        <div class="p-card-name"><a href="product.html">${esc(id)}</a></div>
        <div class="p-card-price">€49.99</div>
      </div>`;
    grid.insertBefore(card, empty);
  });
}

/* ── AUTH SHOW/HIDE ───────────────────────────────────────── */
function showAuth() {
  document.getElementById('auth-box').style.display  = '';
  document.getElementById('dashboard').style.display = 'none';
}

function showDashboard(session) {
  document.getElementById('auth-box').style.display  = 'none';
  document.getElementById('dashboard').style.display = '';
  document.getElementById('acct-name').textContent        = session.name;
  document.getElementById('acct-email-label').textContent = session.email;
  document.getElementById('acct-avatar').textContent      = session.initial || '?';
}

/* ── SESSION HELPERS ──────────────────────────────────────── */
function saveSession(s)  { try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch {} }
function loadSession()   { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch { return null; } }
function clearSession()  { try { sessionStorage.removeItem(SESSION_KEY); } catch {} }
function loadWish()      { try { return JSON.parse(localStorage.getItem('pepika_wish_v1')) || []; } catch { return []; } }
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
