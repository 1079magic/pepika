/* ================================================================
   PEPIKA — CONTACT PAGE JS  (js/contact.js)
   ================================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── CONTACT FORM ─────────────────────────────────────────── */
  document.getElementById('contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('ct-name');
    const email   = document.getElementById('ct-email');
    const subject = document.getElementById('ct-subject');
    const message = document.getElementById('ct-message');
    const consent = document.getElementById('ct-consent');
    let valid     = true;

    /* Clear previous errors */
    [name, email, subject, message].forEach(f => f?.closest('.field')?.classList.remove('invalid'));

    if (!name?.value.trim())                              { name?.closest('.field')?.classList.add('invalid');    valid = false; }
    if (!email?.value.match(/\S+@\S+\.\S+/))             { email?.closest('.field')?.classList.add('invalid');   valid = false; }
    if (!subject?.value)                                  { subject?.closest('.field')?.classList.add('invalid'); valid = false; }
    if (!message?.value.trim())                           { message?.closest('.field')?.classList.add('invalid'); valid = false; }
    if (!consent?.checked) {
      showToast('Please agree to the privacy policy.', 'fa-triangle-exclamation', 'var(--c-error)');
      valid = false;
    }
    if (!valid) return;

    /* Simulate submission */
    const btn = e.target.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…'; }

    setTimeout(() => {
      document.getElementById('form-success').style.display = '';
      e.target.style.display = 'none';
      showToast('Message sent! We\'ll be in touch soon.');
      api.subscribe(email.value); /* reuse subscribe stub for demo */
    }, 1200);
  });

  /* ── FAQ ACCORDION ────────────────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item    = btn.closest('.faq-item');
      const isOpen  = item.classList.contains('open');

      /* Close all */
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));

      /* Open this one if it wasn't already open */
      if (!isOpen) item.classList.add('open');
    });
  });

});
