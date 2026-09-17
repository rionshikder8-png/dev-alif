/* ==========================================================================
   Developer Alif — Portfolio Script
   Theme Toggle, Mobile Nav, Stat Counters, Scroll Animations, Active Links
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Dynamic Year in Footer
  // -------------------------------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------------
  // 2. Theme Toggle (Dark / Light Mode)
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggle');
  const root = document.documentElement;

  // Retrieve saved theme or check system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    const isDark = theme === 'dark';
    
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      themeToggleBtn.setAttribute(
        'aria-label',
        isDark ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }
  };

  // Initial apply
  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', currentTheme);
      applyTheme(currentTheme);
    });
  }

  // -------------------------------------------------------------------------
  // 3. Mobile Navigation Menu Toggle
  // -------------------------------------------------------------------------
  const navBurger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  if (navBurger && navLinks) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !navLinks.classList.contains('is-open');
      navLinks.classList.toggle('is-open', isOpen);
      navBurger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navBurger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    };

    navBurger.addEventListener('click', () => toggleMenu());

    // Close menu when clicking any nav link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close menu when clicking outside the navbar
    document.addEventListener('click', (e) => {
      if (!navBurger.contains(e.target) && !navLinks.contains(e.target)) {
        toggleMenu(false);
      }
    });
  }

  // -------------------------------------------------------------------------
  // 4. Animated Stat Counters (Intersection Observer)
  // -------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length > 0) {
    const animateStats = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const targetEl = entry.target;
          const targetVal = parseFloat(targetEl.getAttribute('data-target')) || 0;
          const suffix = targetEl.getAttribute('data-suffix') || '';
          const decimals = parseInt(targetEl.getAttribute('data-decimal')) || 0;
          
          const duration = 2000; // Animation duration in ms
          const frameRate = 1000 / 60;
          const totalFrames = Math.round(duration / frameRate);
          let frame = 0;

          const counter = setInterval(() => {
            frame++;
            // Ease-out progress calculation
            const progress = frame / totalFrames;
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = targetVal * easeOut;

            targetEl.textContent = currentVal.toFixed(decimals) + suffix;

            if (frame >= totalFrames) {
              targetEl.textContent = targetVal.toFixed(decimals) + suffix;
              clearInterval(counter);
            }
          }, frameRate);

          observer.unobserve(targetEl);
        }
      });
    };

    const statsObserver = new IntersectionObserver(animateStats, {
      threshold: 0.4,
    });

    statNumbers.forEach((stat) => statsObserver.observe(stat));
  }

  // -------------------------------------------------------------------------
  // 5. Scroll Reveal Animations
  // -------------------------------------------------------------------------
  const elementsToReveal = document.querySelectorAll(
    '.about-grid, .edu-card, .work-card, .timeline-item, .built-card, .product-card, .social-btn'
  );

  elementsToReveal.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.15 }
  );

  elementsToReveal.forEach((el) => revealObserver.observe(el));

  // -------------------------------------------------------------------------
  // 6. Active Link Highlighting on Scroll
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navItems.forEach((item) => {
            const href = item.getAttribute('href').replace('#', '');
            if (href === id) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // -------------------------------------------------------------------------
  // 7. Touch Support for Tech & Project Cards
  // -------------------------------------------------------------------------
  const interactiveCards = document.querySelectorAll('.tech-card, .project-card');

  interactiveCards.forEach((card) => {
    card.addEventListener('touchstart', function () {
      interactiveCards.forEach((c) => {
        if (c !== card) c.classList.remove('is-active');
      });
      this.classList.toggle('is-active');
    }, { passive: true });
  });
});
