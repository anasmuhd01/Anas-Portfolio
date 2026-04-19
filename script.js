if ('ontouchstart' in window) {
  document.getElementById('cursor').style.display = 'none';
  document.getElementById('cursor-ring').style.display = 'none';
}


/* ════════════════════════════════════════
   script.js  —  Portfolio JavaScript
   ════════════════════════════════════════

   TABLE OF CONTENTS
   1. Config  ← Edit your personal details here
   2. Custom Cursor
   3. Typing Animation
   4. Scroll Snap + Page Detection
   5. Reveal on Enter
   6. Zoom-Out Scroll Effect
   7. Navigation Dots
   8. Nav Scroll Style
   9. Nav Link Smooth Scroll
   ════════════════════════════════════════ */


/* ─────────────────────────────────────
   1. CONFIG  ← EDIT YOUR DETAILS HERE
───────────────────────────────────── */
const CONFIG = {
  /* Typing animation — your name on the hero */
  name: " Anas ",          // ← change this

  /* How fast the typing goes (milliseconds per character) */
  typingSpeed: 110,

  /* Delay before typing starts (ms) */
  typingDelay: 800,
};


/* ─────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────── */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

/* Ring lags behind cursor for a smooth feel */
(function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
})();

/* Expand ring on hover over interactive elements */
document.querySelectorAll('a, button, .proj-card, .stat-card, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '6px';
    cursor.style.height = '6px';
    ring.style.width = '52px';
    ring.style.height = '52px';
    ring.style.borderColor = 'rgba(0,229,255,0.6)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    ring.style.width = '36px';
    ring.style.height = '36px';
    ring.style.borderColor = 'rgba(0,229,255,0.4)';
  });
});


/* ─────────────────────────────────────
   3. TYPING ANIMATION
───────────────────────────────────── */
const typedEl = document.getElementById('typed-name');
let charIndex = 0;

function typeChar() {
  if (charIndex <= CONFIG.name.length) {
    typedEl.textContent = CONFIG.name.slice(0, charIndex++);
    setTimeout(typeChar, CONFIG.typingSpeed);
  }
}
setTimeout(typeChar, CONFIG.typingDelay);


/* ─────────────────────────────────────
   4. SCROLL SNAP + PAGE DETECTION
───────────────────────────────────── */
const container = document.getElementById('scroll-container');
const pages = document.querySelectorAll('.page');
const dots = document.querySelectorAll('.dot-item');
let currentPage = 0;

/* IntersectionObserver fires when a page is 50% visible */
const pageObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = parseInt(entry.target.dataset.page);
      currentPage = idx;

      /* Highlight the matching dot */
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));

      /* Trigger reveal animations on the entering page */
      triggerReveal(entry.target);
    }
  });
}, { root: container, threshold: 0.5 });

pages.forEach(p => pageObserver.observe(p));


/* ─────────────────────────────────────
   5. REVEAL ON ENTER
   (fade + slide up elements as the
    page scrolls into view)
───────────────────────────────────── */
function triggerReveal(page) {
  /* Stagger each .reveal element */
  page.querySelectorAll('.reveal:not(.visible)').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 60);
  });

  /* Animate skill bars to their target width */
  page.querySelectorAll('.skill-bar-fill').forEach(bar => {
    bar.style.width = bar.dataset.width + '%';
  });
}


/* ─────────────────────────────────────
   6. ZOOM-OUT SCROLL EFFECT
   (current page scales down + fades
    as you scroll toward the next page)
───────────────────────────────────── */
let lastScrollTop = 0;

container.addEventListener('scroll', () => {
  const st = container.scrollTop;
  const dir = st > lastScrollTop ? 'down' : 'up';
  lastScrollTop = st;

  pages.forEach(page => {
    const rect = page.getBoundingClientRect();
    const vh = window.innerHeight;

    /* progress = 0 when fully visible, 1 when fully scrolled past */
    const progress = 1 - Math.max(0, Math.min(1, rect.bottom / vh));

    if (dir === 'down' && progress > 0 && progress < 0.8) {
      const scale = 1 - progress * 0.10;   /* shrinks to 90% */
      const opacity = 1 - progress * 0.60;   /* fades to 40%   */
      page.style.transform = `scale(${scale})`;
      page.style.opacity = opacity;
    } else {
      /* Reset when scrolling back up or fully gone */
      page.style.transform = '';
      page.style.opacity = '';
    }
  });
}, { passive: true });


/* ─────────────────────────────────────
   7. NAVIGATION DOTS
   (click a dot to jump to that page)
───────────────────────────────────── */
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const idx = parseInt(dot.dataset.page);
    pages[idx].scrollIntoView({ behavior: 'smooth' });
  });
});


/* ─────────────────────────────────────
   8. NAV SCROLL STYLE
   (adds a border to nav after scrolling)
───────────────────────────────────── */
container.addEventListener('scroll', () => {
  document.getElementById('main-nav')
    .classList.toggle('scrolled', container.scrollTop > 60);
}, { passive: true });


/* ─────────────────────────────────────
   9. NAV LINK SMOOTH SCROLL
───────────────────────────────────── */
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href').replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ─────────────────────────────
   MOBILE MENU TOGGLE
───────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
});

/* Close menu on link click */
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
  });
});

/* close button */
const closeBtn = document.getElementById('close-btn');

closeBtn.addEventListener('click', () => {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('active');
});