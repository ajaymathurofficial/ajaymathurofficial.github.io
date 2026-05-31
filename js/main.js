/**
 * Ajay Mathur Portfolio — main.js
 * Sawad-inspired: cursor · scroll progress · header · nav · reveals · magnetic · clock · parallax
 */
(() => {
  'use strict';

  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── 1. PAGE LOAD FADE ─────────────────────────────────── */
  document.documentElement.style.opacity = '0';
  window.addEventListener('load', () => {
    document.documentElement.style.transition = 'opacity 0.5s ease';
    document.documentElement.style.opacity = '1';
  });
  setTimeout(() => { document.documentElement.style.opacity = '1'; }, 900);

  /* ── 2. CUSTOM CURSOR ──────────────────────────────────── */
  const dot  = qs('#cursor-dot');
  const ring = qs('#cursor-ring');

  if (dot && ring) {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (isFinePointer) {
      let mx = 0, my = 0, rx = 0, ry = 0;
      const lerp = (a, b, t) => a + (b - a) * t;

      const showCursor = () => {
        dot.classList.add('cursor-visible');
        ring.classList.add('cursor-visible');
      };

      document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        showCursor();
      }, { passive: true });

      const animRing = () => {
        rx = lerp(rx, mx, 0.11);
        ry = lerp(ry, my, 0.11);
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(animRing);
      };
      animRing();

      const hoverTargets = 'a, button, [data-hover], .work-card, .contact-card, .cap-card, .nav-toggle, .proj-filter, .service-row, .service-card';
      document.addEventListener('mouseover', e => {
        if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover');
      }, { passive: true });
      document.addEventListener('mouseout', e => {
        if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover');
      }, { passive: true });

      document.addEventListener('mouseleave', () => {
        dot.classList.remove('cursor-visible');
        ring.classList.remove('cursor-visible');
      });
      document.addEventListener('mouseenter', showCursor);
    }
  }

  /* ── 3. SCROLL PROGRESS ────────────────────────────────── */
  const progressBar = qs('#scroll-progress');
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.transform = `scaleX(${docHeight > 0 ? scrollTop / docHeight : 0})`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ── 4. HEADER — floating pill scroll state ─────────────── */
  const header = qs('#site-header');
  if (header) {
    const updateHeader = () => {
      header.classList.toggle('header--scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  /* ── 5. MOBILE NAV ─────────────────────────────────────── */
  const navToggle = qs('#nav-toggle');
  const navMenu   = qs('#nav-menu');

  if (navToggle && navMenu) {
    const openNav = () => {
      navMenu.classList.add('is-open');
      navToggle.classList.add('is-active');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
    };
    const closeNav = () => {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    };

    navToggle.addEventListener('click', () => {
      navMenu.classList.contains('is-open') ? closeNav() : openNav();
    });

    qsa('.nav__link, .nav__cta', navMenu).forEach(el => el.addEventListener('click', closeNav));

    document.addEventListener('click', e => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) closeNav();
    });

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  }

  /* ── 6. ACTIVE NAV LINK (SCROLLSPY) ────────────────────── */
  const sections = qsa('section[id]');
  const navLinks = qsa('.nav__link');

  const scrollspy = () => {
    let currentId = '';
    const scrollPos = window.scrollY + 160; // offset matching header height

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const targetId = href.includes('#') ? href.split('#')[1] : null;
      link.classList.toggle('nav__link--active', targetId && targetId === currentId);
    });
  };
  window.addEventListener('scroll', scrollspy, { passive: true });
  scrollspy();


  /* ── 7. SCROLL REVEAL ────────────────────────────────── */
  const revealEls = qsa('.reveal, .reveal-left, .reveal-scale');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          target.classList.add('revealed');
          io.unobserve(target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));
  }

  /* ── 8. STAGGER CHILDREN ────────────────────────────────── */
  qsa('[data-stagger]').forEach(parent => {
    qsa('.reveal, .reveal-left, .reveal-scale', parent).forEach((child, i) => {
      child.style.transitionDelay = `${i * 55}ms`;
    });
  });

  /* ── 9. LIVE CLOCK (IST) ───────────────────────────────── */
  const clocks = qsa('#local-time, .footer__live-time');
  if (clocks.length) {
    const fmt = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    });
    const tick = () => { const t = fmt.format(new Date()); clocks.forEach(c => c.textContent = t); };
    tick();
    setInterval(tick, 1000);
  }

  /* ── 10. MAGNETIC BUTTONS ───────────────────────────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    qsa('[data-magnetic]').forEach(el => {
      const strength = parseFloat(el.dataset.magnetic) || 0.26;
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width  / 2)) * strength;
        const dy = (e.clientY - (rect.top  + rect.height / 2)) * strength;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        el.style.transition = 'transform 0.15s ease';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  /* ── 11. SIDEBAR PORTRAIT — removed parallax to prevent visual drift glitches ── */

  /* ── 12. CAP / WORK CARDS — 3D tilt hover ─────────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    qsa('.cap-card, .work-card, .contact-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 7;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 7;
        card.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-6px)`;
        card.style.transition = 'transform 0.15s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  /* ── 13. PROJECT FILTERS ──────────────────────────────── */
  const filterBtns = qsa('.proj-filter');
  const projectCards = qsa('[data-category]');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active state
        filterBtns.forEach(b => b.classList.remove('proj-filter--active'));
        btn.classList.add('proj-filter--active');

        // Show/hide cards
        projectCards.forEach(card => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          if (show) {
            card.style.opacity = '1';
            card.style.transform = '';
            card.style.pointerEvents = '';
          } else {
            card.style.opacity = '0.12';
            card.style.transform = 'scale(0.97)';
            card.style.pointerEvents = 'none';
          }
        });
      });
    });
  }

  /* ── 14. MOBILE PROJECT SLIDER DOTS ──────────────────────── */
  const grid = qs('#projects-grid');
  const cards = qsa('.work-card', grid);

  if (grid && cards.length) {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'project-slider-dots';
    grid.after(dotsContainer);

    const getVisibleCards = () =>
      cards.filter(c => parseFloat(c.style.opacity || '1') > 0.5 && c.style.display !== 'none');

    const rebuildDots = () => {
      dotsContainer.innerHTML = '';
      const visible = getVisibleCards();
      visible.forEach((_, i) => {
        const d = document.createElement('span');
        d.className = 'slider-dot' + (i === 0 ? ' slider-dot--active' : '');
        dotsContainer.appendChild(d);
      });
    };

    const updateActiveDot = () => {
      if (window.innerWidth > 768) return;
      const visible = getVisibleCards();
      if (!visible.length) return;
      // Measure gap from CSS (16px default)
      const gap = 14;
      const cardW = visible[0].offsetWidth + gap;
      const idx = Math.min(visible.length - 1, Math.max(0, Math.round(grid.scrollLeft / cardW)));
      [...dotsContainer.children].forEach((d, i) =>
        d.classList.toggle('slider-dot--active', i === idx));
    };

    rebuildDots();

    grid.addEventListener('scroll', updateActiveDot, { passive: true });

    const toggleDots = () => {
      const show = window.innerWidth <= 768;
      dotsContainer.style.display = show ? 'flex' : 'none';
    };

    window.addEventListener('resize', () => { toggleDots(); updateActiveDot(); }, { passive: true });
    toggleDots();

    // After filter change, wait for animation then rebuild
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          rebuildDots();
          // Scroll grid back to start
          grid.scrollTo({ left: 0, behavior: 'instant' });
          updateActiveDot();
        }, 380);
      });
    });
  }

})();
