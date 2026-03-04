/* ================================================================
   PEPIKA — PRODUCT PAGE JS  (js/product.js)
   Handles: gallery · zoom · thumbnails · variant selectors
            dynamic pricing · qty control · add-to-cart
            tabs · star picker · review form · sticky ATC
   ================================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ─── GALLERY ─────────────────────────────────────────────── */
  const mainImg   = document.getElementById('main-img');
  const thumbs    = [...document.querySelectorAll('.thumb')];
  const galleryEl = document.getElementById('gallery-main');

  /* Collect image sources from thumbnails */
  const images = thumbs.map(t => t.dataset.src);
  let current = 0;

  function setGalleryImage(idx) {
    current = (idx + images.length) % images.length;
    if (mainImg) mainImg.src = images[current];
    thumbs.forEach((t, i) => t.classList.toggle('active', i === current));
  }

  thumbs.forEach((t, i) => {
    t.addEventListener('click', () => setGalleryImage(i));
  });

  document.getElementById('gallery-prev')?.addEventListener('click', () => setGalleryImage(current - 1));
  document.getElementById('gallery-next')?.addEventListener('click', () => setGalleryImage(current + 1));

  /* Keyboard nav */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  setGalleryImage(current - 1);
    if (e.key === 'ArrowRight') setGalleryImage(current + 1);
  });

  /* Zoom on click */
  galleryEl?.addEventListener('click', () => galleryEl.classList.toggle('zoomed'));

  /* ─── VARIANTS + DYNAMIC PRICE ───────────────────────────── */
  const BASE_PRICE  = 49.99;
  let colourMod = 0, sizeMod = 0;
  let colourChosen = true;  // colour has a default
  let sizeChosen   = false;

  const priceEl    = document.getElementById('product-price');
  const stickyPrice= document.getElementById('sticky-price');
  const addCartBtn = document.getElementById('btn-add-cart');
  const selectedColourLabel = document.getElementById('selected-colour');

  function updatePrice() {
    const total = BASE_PRICE + colourMod + sizeMod;
    const fmt   = n => `€${n.toFixed(2)}`;
    if (priceEl)     priceEl.textContent     = fmt(total);
    if (stickyPrice) stickyPrice.textContent = fmt(total);
  }

  function checkReady() {
    const ready = colourChosen && sizeChosen;
    if (addCartBtn) {
      addCartBtn.disabled = !ready;
      addCartBtn.innerHTML = ready
        ? '<i class="fa-solid fa-bag-shopping"></i> Add to Cart'
        : '<i class="fa-solid fa-bag-shopping"></i> Select options to add';
    }
  }

  /* Colour swatches */
  document.querySelectorAll('.color-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch').forEach(s => {
        s.classList.remove('active'); s.setAttribute('aria-pressed', 'false');
      });
      sw.classList.add('active'); sw.setAttribute('aria-pressed', 'true');
      colourMod     = parseFloat(sw.dataset.price) || 0;
      colourChosen  = true;
      if (selectedColourLabel) selectedColourLabel.textContent = sw.dataset.name || sw.title;
      updatePrice(); checkReady();
    });
  });

  /* Size select */
  document.getElementById('size-select')?.addEventListener('change', e => {
    const opt = e.target.options[e.target.selectedIndex];
    sizeMod     = parseFloat(opt.dataset.modifier) || 0;
    sizeChosen  = !!e.target.value;
    updatePrice(); checkReady();
  });

  /* ─── QUANTITY CONTROL ────────────────────────────────────── */
  let qty = 1;
  const qtyNum = document.getElementById('qty-num');
  document.getElementById('qty-dec')?.addEventListener('click', () => {
    if (qty > 1) { qty--; if (qtyNum) qtyNum.textContent = qty; }
  });
  document.getElementById('qty-inc')?.addEventListener('click', () => {
    qty++; if (qtyNum) qtyNum.textContent = qty;
  });

  /* ─── ADD TO CART ─────────────────────────────────────────── */
  function doAddToCart() {
    if (!colourChosen || !sizeChosen) {
      showToast('Please select a finish and size first.', 'fa-triangle-exclamation', 'var(--c-error)');
      return;
    }
    const sizeEl   = document.getElementById('size-select');
    const sizeName = sizeEl?.options[sizeEl.selectedIndex]?.text.split('(')[0].trim() || '';
    const colour   = document.getElementById('selected-colour')?.textContent || '';
    const total    = BASE_PRICE + colourMod + sizeMod;

    cartAdd({
      id:      `prod-001-${colour}-${sizeName}`,
      name:    'Name Plate for Door',
      variant: `${colour} · ${sizeName}`,
      qty,
      price:   total,
      image:   document.getElementById('main-img')?.src || '',
    });
    showToast('Added to cart!');
    openCart();
    api.addToCart({ product_id: 'prod-001', colour, size: sizeName, qty, price: total });
  }

  addCartBtn?.addEventListener('click', doAddToCart);
  document.getElementById('sticky-atc-btn')?.addEventListener('click', doAddToCart);

  /* ─── WISHLIST BUTTON ─────────────────────────────────────── */
  const wishBtn = document.getElementById('btn-wishlist');
  if (wishBtn) {
    // Sync initial state
    const wishId = wishBtn.dataset.wishId;
    const update = () => {
      const w = isWished(wishId);
      wishBtn.classList.toggle('active', w);
      const icon = wishBtn.querySelector('i');
      if (icon) icon.className = w ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      wishBtn.setAttribute('aria-pressed', String(w));
    };
    update();
    wishBtn.addEventListener('click', () => {
      wishToggle(wishId, 'Name Plate for Door'); update();
    });
  }

  /* ─── SHARE / COPY LINK ───────────────────────────────────── */
  document.getElementById('copy-link-btn')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(location.href).then(() => {
      showToast('Link copied!', 'fa-copy', 'var(--c-info)');
    });
  });

  /* ─── TABS ────────────────────────────────────────────────── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${tabId}`)?.classList.add('active');
    });
  });

  /* Deep-link to reviews from rating count */
  document.querySelector('.rating-count')?.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('reviews-tab-btn')?.click();
    document.getElementById('product-tabs')?.scrollIntoView({ behavior:'smooth' });
  });

  /* ─── STAR PICKER ─────────────────────────────────────────── */
  let pickedStars = 0;
  document.querySelectorAll('.star-pick').forEach(star => {
    star.addEventListener('mouseenter', () => {
      const val = +star.dataset.val;
      document.querySelectorAll('.star-pick').forEach((s, i) => {
        s.classList.toggle('lit', i < val);
      });
    });
    star.addEventListener('mouseleave', () => {
      document.querySelectorAll('.star-pick').forEach((s, i) => {
        s.classList.toggle('lit', i < pickedStars);
      });
    });
    star.addEventListener('click', () => {
      pickedStars = +star.dataset.val;
      document.querySelectorAll('.star-pick').forEach((s, i) => {
        s.classList.toggle('lit', i < pickedStars);
      });
    });
  });

  /* ─── REVIEW FORM ─────────────────────────────────────────── */
  document.getElementById('review-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('rv-name');
    const title = document.getElementById('rv-title');
    const body  = document.getElementById('rv-body');
    let valid   = true;

    [name, title, body].forEach(inp => {
      inp?.closest('.field')?.classList.remove('invalid');
    });

    if (!name?.value.trim())  { name?.closest('.field')?.classList.add('invalid'); valid = false; }
    if (!title?.value.trim()) { title?.closest('.field')?.classList.add('invalid'); valid = false; }
    if (!body?.value.trim())  { body?.closest('.field')?.classList.add('invalid'); valid = false; }
    if (pickedStars === 0)    { showToast('Please pick a star rating.', 'fa-star', '#d4a843'); valid = false; }

    if (!valid) return;

    /* Build star string */
    const stars = '★'.repeat(pickedStars) + '☆'.repeat(5 - pickedStars);

    /* Prepend new review card */
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="review-card-head">
        <div class="reviewer-info"><strong>${esc(name.value.trim())}</strong><span>Just now</span></div>
        <div class="review-card-stars">${stars}</div>
      </div>
      <div class="review-card-title">${esc(title.value.trim())}</div>
      <div class="review-card-text">${esc(body.value.trim())}</div>`;

    document.getElementById('review-list')?.prepend(card);

    showToast('Review submitted! Thank you 🙏');
    e.target.reset();
    pickedStars = 0;
    document.querySelectorAll('.star-pick').forEach(s => s.classList.remove('lit'));

    api.submitReview({ product:'prod-001', name:name.value, title:title.value, body:body.value, rating:pickedStars });
  });

  /* ─── STICKY ATC VISIBILITY ───────────────────────────────── */
  const stickyEl = document.getElementById('sticky-atc');
  if (stickyEl && window.innerWidth <= 900) {
    const addRow = document.querySelector('.add-to-cart-row');
    const obs = new IntersectionObserver(entries => {
      stickyEl.style.display = entries[0].isIntersecting ? 'none' : 'flex';
    }, { threshold:0 });
    if (addRow) obs.observe(addRow);
  }

  /* ─── HELPFUL BUTTONS ─────────────────────────────────────── */
  document.querySelectorAll('.review-helpful button').forEach(btn => {
    btn.addEventListener('click', () => {
      const match = btn.textContent.match(/\((\d+)\)/);
      const n = match ? parseInt(match[1]) + 1 : 1;
      btn.textContent = `Yes (${n})`;
      btn.disabled = true;
    });
  });

});

/* ─── esc helper (needed if site.js not yet loaded) ────────── */
function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
