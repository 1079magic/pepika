/* ================================================================
   PEPIKA — SHOP PAGE JS  (js/shop.js)
   Handles: filter accordion · price range · view toggle
            mobile sidebar · active filter tags · sort · pagination
   ================================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── FILTER ACCORDION ────────────────────────────────────── */
  document.querySelectorAll('.filter-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const body   = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      if (body) body.style.display = isOpen ? 'none' : '';
    });
  });

  /* ── PRICE RANGE SLIDERS ─────────────────────────────────── */
  const minSlider = document.getElementById('price-min');
  const maxSlider = document.getElementById('price-max');
  const minVal    = document.getElementById('price-min-val');
  const maxVal    = document.getElementById('price-max-val');

  if (minSlider && maxSlider) {
    const syncPriceRange = () => {
      let lo = +minSlider.value, hi = +maxSlider.value;
      if (lo > hi) { [lo, hi] = [hi, lo]; minSlider.value = lo; maxSlider.value = hi; }
      if (minVal) minVal.textContent = lo;
      if (maxVal) maxVal.textContent = hi;
    };
    minSlider.addEventListener('input', syncPriceRange);
    maxSlider.addEventListener('input', syncPriceRange);
  }

  /* ── VIEW TOGGLE (grid / list) ───────────────────────────── */
  const grid = document.getElementById('products-grid');
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (!grid) return;
      const view = btn.dataset.view;
      grid.classList.toggle('list-view', view === 'list');
    });
  });

  /* ── MOBILE SIDEBAR ──────────────────────────────────────── */
  const sidebar       = document.getElementById('shop-sidebar');
  const openFilterBtn = document.getElementById('mobile-filter-btn');
  const closeBtn      = document.getElementById('sidebar-close-btn');

  const openSidebar  = () => {
    sidebar?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeSidebar = () => {
    sidebar?.classList.remove('open');
    document.body.style.overflow = '';
  };

  openFilterBtn?.addEventListener('click', openSidebar);
  closeBtn?.addEventListener('click', closeSidebar);

  /* Tap outside to close */
  document.addEventListener('click', e => {
    if (sidebar?.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        e.target !== openFilterBtn) {
      closeSidebar();
    }
  });

  /* ── CLEAR FILTERS ───────────────────────────────────────── */
  ['clear-filters', 'clear-filters-2'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      document.querySelectorAll('.filter-check input').forEach(inp => inp.checked = false);
      if (minSlider) minSlider.value = 0;
      if (maxSlider) maxSlider.value = 200;
      if (minVal) minVal.textContent = '0';
      if (maxVal) maxVal.textContent = '200';
      const af = document.getElementById('active-filters');
      if (af) af.innerHTML = '';
      showToast('Filters cleared.', 'fa-sliders', 'var(--c-text-muted)');
    });
  });

  /* ── FILTER CHECKBOXES → ACTIVE TAGS ────────────────────── */
  function rebuildActiveTags() {
    const af = document.getElementById('active-filters');
    if (!af) return;
    af.innerHTML = '';
    document.querySelectorAll('.filter-check input:checked').forEach(inp => {
      const label = inp.closest('.filter-check')?.textContent.trim().replace(/\(\d+\)/, '').trim();
      const tag = document.createElement('span');
      tag.className = 'af-tag';
      tag.innerHTML = `${label} <button aria-label="Remove filter">✕</button>`;
      tag.querySelector('button').addEventListener('click', () => {
        inp.checked = false; rebuildActiveTags();
      });
      af.appendChild(tag);
    });
  }

  document.querySelectorAll('.filter-check input').forEach(inp => {
    inp.addEventListener('change', rebuildActiveTags);
  });

  /* ── SORT ────────────────────────────────────────────────── */
  document.getElementById('sort-select')?.addEventListener('change', e => {
    /*
      For a real site, re-fetch products from API with sort param.
      e.g.: api.getProducts({ sort: e.target.value }).then(renderProducts)
    */
    showToast(`Sorted by: ${e.target.options[e.target.selectedIndex].text}`,
              'fa-arrow-up-wide-short', 'var(--c-text-muted)');
  });

  /* ── PAGINATION ──────────────────────────────────────────── */
  document.querySelectorAll('.pagination .page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.querySelector('i')) return; // skip arrow btns
      document.querySelectorAll('.pagination .page-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* ── SUBCAT PILLS (category page) ───────────────────────── */
  document.querySelectorAll('.subcat-pill').forEach(pill => {
    pill.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.subcat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

});
