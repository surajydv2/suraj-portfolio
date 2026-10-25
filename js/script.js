const navToggle = document.querySelector('.nav-toggle');
const navPanel = document.querySelector('.nav-panel');
const yearElement = document.getElementById('year');
const contactForm = document.getElementById('contactForm');
const hero = document.querySelector('.hero');
const heroScene = document.querySelector('.hero-scene');
const heroImage = document.querySelector('.hero-composite');
const parallaxItems = document.querySelectorAll('[data-parallax]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

if (navToggle && navPanel) {
  const closeMenu = () => {
    navPanel.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navPanel.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  navPanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navPanel.classList.contains('is-open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (
      navPanel.classList.contains('is-open') &&
      !navPanel.contains(event.target) &&
      !navToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });
}

const revealItems = document.querySelectorAll('.reveal');
const canReveal = 'IntersectionObserver' in window && !reducedMotion.matches;

if (canReveal) {
  document.documentElement.classList.add('js');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -35px 0px' }
  );

  revealItems.forEach((item, index) => {
    if (item.classList.contains('journey-step') || item.classList.contains('skill-card')) {
      item.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
    }
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

if (hero && heroScene && !reducedMotion.matches) {
  let frameRequested = false;

  const updateScrollScene = () => {
    const heroHeight = Math.max(hero.offsetHeight, 1);
    const progress = Math.min(Math.max(window.scrollY / (heroHeight * 0.82), 0), 1);

    hero.style.setProperty('--hero-progress', progress.toFixed(3));
    hero.style.setProperty('--hero-opacity', String(Math.max(1 - progress * 1.1, 0)));
    hero.style.setProperty('--hero-copy-y', `${-progress * 38}px`);
    hero.style.setProperty('--purple-glow-alpha', String(0.21 - progress * 0.12));
    hero.style.setProperty('--blue-glow-alpha', String(0.13 + progress * 0.14));
    heroScene.style.setProperty('--scene-y', `${-progress * 38}px`);
    heroScene.style.setProperty('--scene-z', `${-progress * 90}px`);
    heroScene.style.setProperty('--scene-scale', String(1 - progress * 0.08));
    frameRequested = false;
  };

  const requestSceneUpdate = () => {
    if (!frameRequested) {
      window.requestAnimationFrame(updateScrollScene);
      frameRequested = true;
    }
  };

  window.addEventListener('scroll', requestSceneUpdate, { passive: true });
  window.addEventListener('resize', requestSceneUpdate);
  updateScrollScene();

  if (heroImage && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    heroScene.addEventListener('pointermove', (event) => {
      const bounds = heroScene.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      heroImage.style.setProperty('--image-rx', `${(-y * 5).toFixed(2)}deg`);
      heroImage.style.setProperty('--image-ry', `${(x * 5).toFixed(2)}deg`);
    });

    heroScene.addEventListener('pointerleave', () => {
      heroImage.style.setProperty('--image-rx', '0deg');
      heroImage.style.setProperty('--image-ry', '0deg');
    });

    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.setProperty('--tilt-x', `${(x * 2.2).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${(-y * 2.2).toFixed(2)}deg`);
      });

      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }
}

if (parallaxItems.length && !reducedMotion.matches) {
  let parallaxFrameRequested = false;

  const updateParallax = () => {
    parallaxItems.forEach((item) => {
      const bounds = item.getBoundingClientRect();
      const distance = (bounds.top + bounds.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const offset = Math.min(Math.max(distance, -1), 1) * -14;
      item.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`);
    });
    parallaxFrameRequested = false;
  };

  const requestParallaxUpdate = () => {
    if (!parallaxFrameRequested) {
      window.requestAnimationFrame(updateParallax);
      parallaxFrameRequested = true;
    }
  };

  window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
  window.addEventListener('resize', requestParallaxUpdate);
  updateParallax();
}

const pageSections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

if ('IntersectionObserver' in window && pageSections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => {
          const isCurrent =
            link.hash === `#${entry.target.id}` ||
            (entry.target.id === 'about' && link.getAttribute('href') === 'about.html');
          link.classList.toggle('is-active', isCurrent);
          if (isCurrent) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    },
    { rootMargin: '-35% 0px -55% 0px' }
  );

  pageSections.forEach((section) => sectionObserver.observe(section));

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY < 140) {
        navLinks.forEach((link) => {
          const isHome = link.hash === '#top';
          link.classList.toggle('is-active', isHome);
          if (isHome) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      }
    },
    { passive: true }
  );
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const subject = String(formData.get('subject') || 'Portfolio inquiry').trim();
    const message = String(formData.get('message') || '').trim();
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailto = `mailto:yadavsuraj120415@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  });
}
