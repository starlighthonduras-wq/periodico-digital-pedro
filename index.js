/* ==========================================================================
   AGENDA DIGITAL v2.0 — JavaScript
   Multi-page routing, cinematic loading, SVG effects, sidebar injection
   ========================================================================== */

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ===================================================================
  // LOADING SCREEN — 3 second cinematic intro
  // ===================================================================
  function initLoader() {
    const loader = $('#loader');
    if (!loader) return;

    // Ensure body doesn't scroll during loading
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      loader.classList.add('loader--hidden');
      document.body.style.overflow = '';

      // Remove from DOM after transition
      setTimeout(() => {
        loader.remove();
      }, 600);
    }, 3000);
  }

  // ===================================================================
  // MULTI-PAGE ROUTER (Hash-based SPA)
  // ===================================================================
  const Router = {
    pages: {},
    currentPage: null,

    init() {
      // Collect all pages
      $$('[data-page]').forEach(el => {
        this.pages[el.dataset.page] = el;
      });

      // Listen to hash changes
      window.addEventListener('hashchange', () => this.navigate());

      // Listen to nav clicks
      $$('[data-nav]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = link.dataset.nav;
          window.location.hash = target;
        });
      });

      // Initial navigation
      this.navigate();
    },

    navigate() {
      const hash = window.location.hash.slice(1) || 'inicio';
      const targetPage = this.pages[hash];
      if (!targetPage) return;

      // Skip if already on this page
      if (this.currentPage === hash) return;

      // Hide all pages
      Object.values(this.pages).forEach(p => {
        p.classList.remove('active', 'visible');
      });

      // Show target page
      targetPage.classList.add('active');

      // Trigger visible animation (next frame)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          targetPage.classList.add('visible');
        });
      });

      // Update nav active state
      $$('[data-nav]').forEach(link => {
        link.classList.toggle('active', link.dataset.nav === hash);
      });

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Inject sidebar for section pages
      this.injectSidebar(hash);

      // Re-observe reveals for the new page
      setTimeout(() => initScrollRevealForPage(targetPage), 100);

      this.currentPage = hash;

      // Close mobile nav if open
      const mobileNav = $('#mobile-nav');
      if (mobileNav && mobileNav.classList.contains('active')) {
        toggleMobileMenu(false);
      }
    },

    injectSidebar(page) {
      const sidebarEl = $(`#sidebar-${page}`);
      if (!sidebarEl || sidebarEl.children.length > 0) return;

      sidebarEl.innerHTML = `
        <!-- Most Read -->
        <div class="sidebar__widget">
          <div class="sidebar__widget-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            Lo Más Leído
          </div>
          <div class="sidebar__widget-body">
            <div class="most-read-item"><span class="most-read-item__number">1</span><span class="most-read-item__title">Líderes mundiales firman acuerdo histórico para reducir emisiones</span></div>
            <div class="most-read-item"><span class="most-read-item__number">2</span><span class="most-read-item__title">Reforma educativa aprobada: transformación de las aulas</span></div>
            <div class="most-read-item"><span class="most-read-item__number">3</span><span class="most-read-item__title">Selección Nacional clasifica al Mundial 2026</span></div>
            <div class="most-read-item"><span class="most-read-item__number">4</span><span class="most-read-item__title">Nuevo tratamiento contra el alzheimer en pruebas clínicas</span></div>
            <div class="most-read-item"><span class="most-read-item__number">5</span><span class="most-read-item__title">Startup local recauda $200 millones en Serie C</span></div>
          </div>
        </div>

        <!-- Social Links -->
        <div class="sidebar__widget">
          <div class="sidebar__widget-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            Síguenos
          </div>
          <div class="sidebar__widget-body">
            <div class="social-links">
              <a href="#" class="social-link social-link--x"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>X / Twitter</a>
              <a href="#" class="social-link social-link--fb"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>Facebook</a>
              <a href="#" class="social-link social-link--ig"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>Instagram</a>
              <a href="#" class="social-link social-link--yt"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>YouTube</a>
            </div>
          </div>
        </div>

        <!-- Ad Placeholder -->
        <div class="ad-placeholder">Publicidad</div>
      `;
    }
  };

  // ===================================================================
  // SCROLL REVEAL
  // ===================================================================
  let revealObserver = null;

  function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    $$('.reveal, .reveal-stagger').forEach(el => revealObserver.observe(el));
  }

  function initScrollRevealForPage(page) {
    if (!revealObserver || !page) return;
    $$('.reveal:not(.visible), .reveal-stagger:not(.visible)', page).forEach(el => {
      revealObserver.observe(el);
    });
  }

  // ===================================================================
  // CURRENT DATE
  // ===================================================================
  function setCurrentDate() {
    const el = $('#current-date');
    if (!el) return;
    const now = new Date();
    const formatted = now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    el.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  // ===================================================================
  // STICKY NAV
  // ===================================================================
  function initStickyNav() {
    const nav = $('#main-nav');
    if (!nav) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ===================================================================
  // MOBILE NAV
  // ===================================================================
  function toggleMobileMenu(open) {
    const btn = $('#hamburger-btn');
    const overlay = $('#mobile-overlay');
    const nav = $('#mobile-nav');
    if (!btn || !overlay || !nav) return;
    btn.classList.toggle('active', open);
    overlay.classList.toggle('active', open);
    nav.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function initMobileNav() {
    const btn = $('#hamburger-btn');
    const overlay = $('#mobile-overlay');
    const nav = $('#mobile-nav');
    if (!btn || !overlay || !nav) return;

    btn.addEventListener('click', () => {
      toggleMobileMenu(!nav.classList.contains('active'));
    });
    overlay.addEventListener('click', () => toggleMobileMenu(false));
    $$('a', nav).forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) toggleMobileMenu(false);
    });
  }

  // ===================================================================
  // BACK TO TOP
  // ===================================================================
  function initBackToTop() {
    const btn = $('#back-to-top');
    if (!btn) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          btn.classList.toggle('visible', window.scrollY > 600);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ===================================================================
  // NEWSLETTER
  // ===================================================================
  function initNewsletter() {
    const form = $('#newsletter-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('#newsletter-email');
      const btn = $('#newsletter-submit');
      if (input && input.value) {
        const original = btn.textContent;
        btn.textContent = '¡Suscrito! ✓';
        btn.style.background = '#16A34A';
        input.value = '';
        setTimeout(() => { btn.textContent = original; btn.style.background = ''; }, 3000);
      }
    });
  }

  // ===================================================================
  // SEARCH
  // ===================================================================
  function initSearch() {
    const input = $('#search-input');
    const btn = $('#search-btn');
    if (!input || !btn) return;
    btn.addEventListener('click', () => {
      if (input.value.trim()) {
        alert(`Buscando: "${input.value.trim()}"\n\n(Función disponible próximamente)`);
        input.value = '';
      } else { input.focus(); }
    });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); btn.click(); } });
  }

  // ===================================================================
  // IMAGE FALLBACK
  // ===================================================================
  function initImageFallback() {
    $$('img').forEach(img => {
      img.addEventListener('error', function () {
        this.style.background = 'linear-gradient(135deg, #E2E8F0, #CBD5E1)';
        this.alt = 'Imagen no disponible';
      });
    });
  }

  // ===================================================================
  // TICKER
  // ===================================================================
  function initTicker() {
    const track = $('.ticker-track');
    if (!track) return;
    const children = [...track.children];
    if (children.length < 10) {
      children.forEach(child => track.appendChild(child.cloneNode(true)));
    }
  }

  // ===================================================================
  // KEYBOARD ACCESSIBILITY
  // ===================================================================
  function initA11y() {
    $$('.news-item, .card, .hero__side-item, .hero__main, .opinion-card, .most-read-item, .preview-card').forEach(el => {
      if (!el.getAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'article');
      }
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
      });
    });
  }

  // ===================================================================
  // PREVIEW CARDS NAVIGATION
  // ===================================================================
  function initPreviewCards() {
    $$('.preview-card[data-nav]').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.dataset.nav;
        window.location.hash = target;
      });
    });
  }

  // ===================================================================
  // ACCORDION
  // ===================================================================
  function initAccordion() {
    $$('.accordion').forEach(accordion => {
      $$('.accordion__trigger', accordion).forEach(trigger => {
        trigger.addEventListener('click', () => {
          const item = trigger.closest('.accordion__item');
          const panel = item.querySelector('.accordion__panel');
          const isActive = item.classList.contains('active');

          // Close all items in this accordion
          $$('.accordion__item', accordion).forEach(otherItem => {
            const otherPanel = otherItem.querySelector('.accordion__panel');
            otherItem.classList.remove('active');
            if (otherPanel) otherPanel.style.maxHeight = null;
          });

          // Open the clicked item (if it wasn't already open)
          if (!isActive) {
            item.classList.add('active');
            if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
          }
        });
      });
    });
  }

// ===================================================================
// SIDE ADS — Sticky positioning with boundaries
// ===================================================================
function initSideAds() {
  const sideAds = $$('.side-ads');
  if (!sideAds.length) return;

  const main = $('#main-content');
  const ticker = $('.ticker');
  const newsletter = $('.newsletter');
  if (!main || !ticker || !newsletter) return;

  const GAP = 50;
  const NAV_HEIGHT = 50;

  function updateSideAds() {
    const scrollY = window.scrollY;
    const adHeight = sideAds[0].offsetHeight;
    const mainTop = main.offsetTop;
    const nlTop = newsletter.offsetTop;

    const upperStop = mainTop + GAP;
    const lowerStop = nlTop - adHeight - GAP;
    const viewportLowerStop = lowerStop - scrollY;

    let top;
    if (scrollY + NAV_HEIGHT >= upperStop) {
      top = NAV_HEIGHT + GAP;
      if (top > viewportLowerStop) {
        top = Math.max(-adHeight, viewportLowerStop);
      }
    } else {
      top = upperStop - scrollY;
    }

    sideAds.forEach(ad => {
      ad.style.position = 'fixed';
      ad.style.top = top + 'px';
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateSideAds();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateSideAds, 100);
  });

  updateSideAds();
}

// ===================================================================
// INIT
// ===================================================================
function init() {
  initLoader();
  setCurrentDate();
  initStickyNav();
  initMobileNav();
  initScrollReveal();
  initBackToTop();
  initNewsletter();
  initSearch();
  initImageFallback();
  initTicker();
  initA11y();
  initPreviewCards();
  initAccordion();
  initSideAds();

  // Initialize router after loader gives DOM time to paint
  setTimeout(() => {
    Router.init();
  }, 100);
}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
