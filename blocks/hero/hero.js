export default function decorate(block) {
  if (!block) return;

  // Extract rows from the default EDS table structure
  const rows = [...block.children];

  // Build proper hero DOM wrapper
  block.innerHTML = `
    <div class="hero-wrapper">
      <div class="hero-slides"></div>
      <div class="hero-nav">
        <button class="hero-nav--prev" aria-label="Previous">&#10094;</button>
        <button class="hero-nav--next" aria-label="Next">&#10095;</button>
      </div>
      <div class="hero-dots"></div>
    </div>
  `;

  const slidesContainer = block.querySelector('.hero-slides');
  const dotsContainer = block.querySelector('.hero-dots');

  const slides = [];

  // Convert each Google Docs row → a proper slide
  rows.forEach((row) => {
    const cols = [...row.children];
    const desktop = cols[0]?.textContent?.trim() || "";
    const mobile = cols[1]?.textContent?.trim() || "";
    const title = cols[2]?.textContent?.trim() || "";
    const subtitle = cols[3]?.textContent?.trim() || "";

    const slide = document.createElement('div');
    slide.classList.add('hero-slide');
    slide.innerHTML = `
      <div class="hero-bg hero-bg--desktop" style="background-image:url('${desktop}')"></div>
      <div class="hero-bg hero-bg--mobile" style="background-image:url('${mobile}')"></div>
      <div class="hero-content">
        <h2>${title}</h2>
        <p>${subtitle}</p>
      </div>
    `;
    slidesContainer.append(slide);
    slides.push(slide);
  });

  // Carousel logic -----------------------

  let current = 0;
  const total = slides.length;
  const dots = [];
  let timer = null;

  function goTo(n) {
    current = (n + total) % total;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() { timer = setInterval(next, 5000); }
  function stopAuto() { clearInterval(timer); }

  // dots
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.addEventListener('click', () => { goTo(i); stopAuto(); startAuto(); });
    dotsContainer.append(btn);
    dots.push(btn);
  });

  // navigation
  block.querySelector('.hero-nav--prev').onclick = () => { prev(); stopAuto(); startAuto(); };
  block.querySelector('.hero-nav--next').onclick = () => { next(); stopAuto(); startAuto(); };

  goTo(0);
  startAuto();
}
