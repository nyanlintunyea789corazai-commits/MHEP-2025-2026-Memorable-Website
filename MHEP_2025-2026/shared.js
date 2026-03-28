// =============================================
//  MINMAHAW — SHARED JS (NOIRE THEME)
//  Typewriter + Scroll Fades + Audio + Navbar
// =============================================

// ── TYPEWRITER ENGINE ──
function typeWriter(el, text, speed, onDone) {
  el.textContent = '';
  el.style.borderRight = '1.5px solid rgba(200,188,158,0.65)';
  let i = 0;
  let cancelled = false;
  let timer = null;

  function d(ch) {
    if ('.!?'.includes(ch)) return speed * 8;
    if (ch === ',')          return speed * 3.5;
    if (ch === '\n')         return speed * 5;
    if (ch === ' ')          return speed * 0.5;
    return speed + Math.random() * 14;
  }

  function type() {
    if (cancelled) return;
    if (i < text.length) {
      const ch = text[i++];
      el.textContent += ch;
      timer = setTimeout(type, d(ch));
    } else {
      let b = 0;
      const blink = setInterval(() => {
        if (cancelled) { clearInterval(blink); el.style.borderRight = 'none'; return; }
        el.style.borderRight = b++ % 2 === 0
          ? '1.5px solid transparent'
          : '1.5px solid rgba(200,188,158,0.65)';
        if (b > 7) {
          clearInterval(blink);
          el.style.borderRight = 'none';
          if (onDone) onDone();
        }
      }, 420);
    }
  }

  type();
  return function cancel() {
    cancelled = true;
    clearTimeout(timer);
    el.style.borderRight = 'none';
  };
}

// ── HERO ENTRANCE ──
function initHero() {
  const tag  = document.querySelector('.hero-tag');
  const rule = document.querySelector('.hero-rule');
  const h1   = document.querySelector('.hero h1');
  const p    = document.querySelector('.hero > .hero-content > p');
  const btn  = document.querySelector('.hero-btn');

  if (tag)  setTimeout(() => tag.classList.add('show'), 300);
  if (rule) setTimeout(() => rule.classList.add('expand'), 650);

  if (h1) {
    const text = h1.textContent.trim();
    h1.textContent = '';
    setTimeout(() => {
      h1.classList.add('show');
      typeWriter(h1, text, 70, () => {
        if (p) {
          const pt = p.textContent.trim();
          p.textContent = '';
          p.classList.add('show');
          setTimeout(() => typeWriter(p, pt, 26), 300);
        }
        if (btn) setTimeout(() => btn.classList.add('show'), 800);
      });
    }, 900);
  }
}

// ── SCROLL FADE-UPS ──
function initFadeUps() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('show'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}

// ── SECTION TITLE TYPEWRITER ON SCROLL ──
function initSectionTyping() {
  document.querySelectorAll('[data-type]').forEach(el => {
    const text = el.getAttribute('data-type');
    el.textContent = '';
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          typeWriter(el, text, el.dataset.speed ? Number(el.dataset.speed) : 70);
          obs.disconnect();
        }
      });
    }, { threshold: 0.5 });
    obs.observe(el);
  });
}

// ── CARD HOVER TYPING ──
function initCardTyping() {
  document.querySelectorAll('.box').forEach(box => {
    const p = box.querySelector('.overlay p');
    if (!p) return;
    const orig = p.textContent.trim();
    let cancelFn = null;

    box.addEventListener('mouseenter', () => {
      if (cancelFn) { cancelFn(); cancelFn = null; }
      cancelFn = typeWriter(p, orig, 18);
    });

    box.addEventListener('mouseleave', () => {
      if (cancelFn) { cancelFn(); cancelFn = null; }
      p.textContent = orig;
      p.style.borderRight = 'none';
    });
  });
}

// ── AUDIO ──
function initAudio() {
  const audio = document.getElementById('bg-audio');
  const btn   = document.getElementById('audio-toggle');
  if (!audio || !btn) return;
  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      btn.textContent = '\u23F8';
      btn.style.background  = 'var(--sand)';
      btn.style.color       = 'var(--black)';
      btn.style.borderColor = 'var(--sand)';
    } else {
      audio.pause();
      btn.textContent = '\u25B6';
      btn.style.background  = '';
      btn.style.color       = '';
      btn.style.borderColor = '';
    }
  });
}

// ── NAVBAR SCROLL ──
function initNavbarScroll() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ── BOOT ──
window.addEventListener('load', () => {
  initHero();
  initFadeUps();
  initSectionTyping();
  initCardTyping();
  initAudio();
  initNavbarScroll();
});
