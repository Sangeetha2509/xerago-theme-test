// homepage-hero.js - production-ready vanilla JS carousel with ESLint fixes
// Usage: decorate(block) will be called by EDS systems when the block is rendered.

export default function decorate(block) {
  if (!block) return;

  const slides = Array.from(block.querySelectorAll('.hero-slide'));
  if (!slides.length) return;

  // lazy set background images (desktop/mobile)
  slides.forEach((slide) => {
    const bgDesktop = slide.querySelector('.hero-bg--desktop');
    const bgMobile = slide.querySelector('.hero-bg--mobile');

    const desktopSrc = bgDesktop?.getAttribute('data-bg-desktop');
    const mobileSrc = bgMobile?.getAttribute('data-bg-mobile');

    // choose source based on viewport; still set both to support resizing
    if (desktopSrc) {
      const img = new Image();
      img.src = desktopSrc;
      img.onload = () => {
        bgDesktop.style.backgroundImage = `url("${desktopSrc}")`;
      };
    }
    if (mobileSrc) {
      const img2 = new Image();
      img2.src = mobileSrc;
      img2.onload = () => {
        bgMobile.style.backgroundImage = `url("${mobileSrc}")`;
      };
    }
  });

  let current = 0;
  const total = slides.length;
  const intervalMs = 5000;
  let timer = null;
  let isPlaying = true;

  // setup dots
  const dotsContainer = block.querySelector('.hero-dots');
  const dots = [];
  slides.forEach((slide, i) => {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
    btn.addEventListener('click', () => {
      goTo(i);
      restartTimer();
    });
    dotsContainer.appendChild(btn);
    dots.push(btn);
  });

  // setup arrows
  const prevBtn = block.querySelector('.hero-nav--prev');
  const nextBtn = block.querySelector('.hero-nav--next');

  const goTo = (indexParam) => {
    let index = indexParam;
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    slides.forEach((s, i) => {
      s.classList.toggle('is-active', i === index);
      dots[i].classList.toggle('is-active', i === index);
    });
    current = index;
  };

  const next = () => { goTo(current + 1); };
  const prev = () => { goTo(current - 1); };

  const startTimer = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(next, intervalMs);
    isPlaying = true;
  };

  const stopTimer = () => {
    if (timer) clearInterval(timer);
    timer = null;
    isPlaying = false;
  };

  const restartTimer = () => {
    stopTimer();
    startTimer();
  };

  // pause on hover (desktop)
  block.addEventListener('mouseenter', stopTimer);
  block.addEventListener('mouseleave', () => { if (!isPlaying) startTimer(); });

  // touch / swipe support
  let touchStartX = null;
  block.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopTimer();
  }, { passive: true });

  block.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) next(); else prev();
    }
    touchStartX = null;
    restartTimer();
  });

  // keyboard support
  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prev(); restartTimer(); }
    if (e.key === 'ArrowRight') { next(); restartTimer(); }
  });

  // initialize
  goTo(0);
  startTimer();

  // make sure block is focusable for keyboard interactions
  block.tabIndex = 0;
}
