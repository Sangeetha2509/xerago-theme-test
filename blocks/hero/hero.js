// hero.js — ESLint compliant + EDS compatible

export default function decorate(block) {
  if (!block) return;

  // Extract rows from default Google Docs table
  const rows = [...block.children];

  // Build clean hero wrapper structure
  block.innerHTML = `
    <div class='hero-wrapper'>
      <div class='hero-slides'></div>
      <div class='hero-nav'>
        <button class='hero-nav--prev' aria-label='Previous'>&#10094;</button>
        <button class='hero-nav--next' aria-label='Next'>&#10095;</button>
      </div>
      <div class='hero-dots'></div>
    </div>
  `;

  const slidesContainer = block.querySelector('.hero-slides');
  const dotsContainer = block.querySelector('.hero-dots');

  const slides = [];

  // Convert table → slides
  rows.forEach((row) => {
    const cols = [...row.children];

    const desktop = cols[0]?.textContent?.trim() || '';
    const mobile = cols[1]?.textContent?.trim() || '';
    const title = cols[2]?.textContent?.trim() || '';
    const subtitle = cols[3]?.textContent?.trim() || '';

    const slide = document.createElement('div');
    slide.classList.add('hero-slide');

    slide.innerHTML = `
      <div class='hero-bg hero-bg--desktop'></div>
      <div class='hero-bg hero-bg--mobile'></div>
      <div class='hero-content'>
        <h2>${title}</h2>
        <p>${subtitle}</p>
      </div>
    `;

    // Lazy load background images
    const bgDesktop = slide.querySelector('.hero-bg--desktop');
    const bgMobile = slide.querySelector('.hero-bg--mobile');

    if (desktop) {
      const img = new Image();
      img.src = desktop;
      img.onload = () => {
        bgDesktop.style.backgroundImage = `url('${desktop}')`;
      };
    }

    if (mobile) {
      const imgM = new Image();
      imgM.src = mobile;
      imgM.onload = () => {
        bgMobile.style.backgroundImage = `url('${mobile}')`;
      };
    }

    slidesContainer.append(slide);
    slides.push(slide);
  });

  // ----- Carousel Logic -----

  let current = 0;
  const total = slides.length;
  const dots = [];
  let timer = null;

  function goTo(n) {
    current = (n + total) % total;

    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
    });
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function startAuto() {
    timer = setInterval(next, 5000);
  }

  function stopAuto() {
    if (timer) clearInterval(timer);
  }

  // Create dots for each slide
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', `Go to slide ${i + 1}`);

    btn.addEventListener('click', () => {
      goTo(i);
      stopAuto();
      startAuto();
    });

    dotsContainer.append(btn);
    dots.push(btn);
  });

  // Navigation buttons
  const prevBtn = block.querySelector('.hero-nav--prev');
  const nextBtn = block.querySelector('.hero-nav--next');

  prevBtn.addEventListener('click', () => {
    prev();
    stopAuto();
    startAuto();
  });

  nextBtn.addEventListener('click', () => {
    next();
    stopAuto();
    startAuto();
  });

  // Swipe support
  let touchStartX = null;

  block.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopAuto();
  });

  block.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;

    if (Math.abs(diff) > 40) {
      if (diff < 0) next();
      else prev();
    }

    touchStartX = null;
    startAuto();
  });

  // Keyboard navigation
  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Init
  block.tabIndex = 0;
  goTo(0);
  startAuto();
}
