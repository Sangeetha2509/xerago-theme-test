export default function decorate(block) {
  if (!block) return;

  const slides = Array.from(block.querySelectorAll('.hero-slide'));
  if (!slides.length) return;

  // Lazy background loading
  slides.forEach((slide) => {
    const bgDesktop = slide.querySelector('.hero-bg--desktop');
    const bgMobile = slide.querySelector('.hero-bg--mobile');

    const desktopSrc = bgDesktop?.dataset.bgDesktop;
    const mobileSrc = bgMobile?.dataset.bgMobile;

    if (desktopSrc) {
      const img = new Image();
      img.src = desktopSrc;
      img.onload = () => {
        bgDesktop.style.backgroundImage = `url("${desktopSrc}")`;
      };
    }

    if (mobileSrc) {
      const imgM = new Image();
      imgM.src = mobileSrc;
      imgM.onload = () => {
        bgMobile.style.backgroundImage = `url("${mobileSrc}")`;
      };
    }
  });

  let current = 0;
  const total = slides.length;
  const intervalMs = 5000;
  let timer = null;

  // ---------------------------------------------------
  // FIX: Declare dots BEFORE goTo() so ESLint passes
  // ---------------------------------------------------

  const dots = [];
  const dotsContainer = block.querySelector('.hero-dots');

  function goTo(index) {
    let idx = index;
    if (idx < 0) idx = total - 1;
    if (idx >= total) idx = 0;

    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === idx);
      dots[i].classList.toggle('is-active', i === idx);
    });

    current = idx;
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(() => next(), intervalMs);
  }

  function restartTimer() {
    stopTimer();
    startTimer();
  }

  // Build dots AFTER declaring dots array
  slides.forEach((slide, i) => {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
    btn.addEventListener('click', () => {
      goTo(i);
      restartTimer();
    });
    dotsContainer.append(btn);
    dots.push(btn);
  });

  // arrow buttons
  const prevBtn = block.querySelector('.hero-nav--prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prev();
      restartTimer();
    });
  }

  const nextBtn = block.querySelector('.hero-nav--next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      next();
      restartTimer();
    });
  }

  // swipe support
  let touchStartX = null;

  block.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopTimer();
  });

  block.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;

    if (Math.abs(diff) > 40) {
      if (diff < 0) next();
      else prev();
    }

    touchStartX = null;
    restartTimer();
  });

  // keyboard support
  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prev();
      restartTimer();
    }
    if (e.key === 'ArrowRight') {
      next();
      restartTimer();
    }
  });

  // init
  goTo(0);
  startTimer();

  block.tabIndex = 0;
}
