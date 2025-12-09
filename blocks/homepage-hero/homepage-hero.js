// homepage-hero.js - production-ready vanilla JS carousel with ESLint fixes
// Usage: decorate(block) will be called by EDS systems when the block is rendered.

export default function decorate(block) {
  if (!block) return;

  // Parse table structure from Google Docs
  // The block will have rows like: header row, then data rows
  const rows = Array.from(block.querySelectorAll(':scope > div'));
  
  // Skip header row (first row) and parse data rows
  const dataRows = rows.slice(1);
  
  // If no data rows, check if slides already exist (from .plain.html template)
  let slides = Array.from(block.querySelectorAll('.hero-slide'));
  
  if (slides.length === 0 && dataRows.length > 0) {
    // Parse CSV-like structure from table rows
    const heroTrack = document.createElement('div');
    heroTrack.classList.add('hero-track');
    
    dataRows.forEach((row) => {
      const cols = Array.from(row.querySelectorAll(':scope > div'));
      if (cols.length >= 8) {
        // Extract data from columns (skip first column which is "homepage-hero")
        const slideOrder = cols[1]?.textContent?.trim() || '';
        const title = cols[2]?.textContent?.trim() || '';
        const subtitle = cols[3]?.textContent?.trim() || '';
        const ctaLabel = cols[4]?.textContent?.trim() || '';
        const ctaLink = cols[5]?.textContent?.trim() || '';
        const bgDesktop = cols[6]?.textContent?.trim() || '';
        const bgMobile = cols[7]?.textContent?.trim() || '';
        
        // Create slide element
        const slide = document.createElement('div');
        slide.classList.add('hero-slide');
        slide.setAttribute('data-slide-index', slideOrder);
        
        // Create background elements
        const bgDesktopEl = document.createElement('div');
        bgDesktopEl.classList.add('hero-bg', 'hero-bg--desktop');
        bgDesktopEl.setAttribute('data-bg-desktop', bgDesktop);
        
        const bgMobileEl = document.createElement('div');
        bgMobileEl.classList.add('hero-bg', 'hero-bg--mobile');
        bgMobileEl.setAttribute('data-bg-mobile', bgMobile);
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.classList.add('hero-overlay');
        
        // Create content
        const content = document.createElement('div');
        content.classList.add('hero-content', 'container');
        
        const copy = document.createElement('div');
        copy.classList.add('hero-copy');
        
        const titleEl = document.createElement('h1');
        titleEl.classList.add('hero-title');
        titleEl.textContent = title;
        
        const subtitleEl = document.createElement('p');
        subtitleEl.classList.add('hero-subtitle');
        subtitleEl.textContent = subtitle;
        
        const ctaEl = document.createElement('a');
        ctaEl.classList.add('hero-cta');
        ctaEl.href = ctaLink;
        ctaEl.textContent = ctaLabel;
        
        copy.appendChild(titleEl);
        copy.appendChild(subtitleEl);
        copy.appendChild(ctaEl);
        content.appendChild(copy);
        
        slide.appendChild(bgDesktopEl);
        slide.appendChild(bgMobileEl);
        slide.appendChild(overlay);
        slide.appendChild(content);
        
        heroTrack.appendChild(slide);
      }
    });
    
    // Clear block and add new structure
    block.innerHTML = '';
    block.appendChild(heroTrack);
    
    // Add controls
    const prevBtn = document.createElement('button');
    prevBtn.classList.add('hero-nav', 'hero-nav--prev');
    prevBtn.setAttribute('aria-label', 'Previous slide');
    prevBtn.setAttribute('type', 'button');
    prevBtn.textContent = '‹';
    
    const nextBtn = document.createElement('button');
    nextBtn.classList.add('hero-nav', 'hero-nav--next');
    nextBtn.setAttribute('aria-label', 'Next slide');
    nextBtn.setAttribute('type', 'button');
    nextBtn.textContent = '›';
    
    const dotsContainer = document.createElement('div');
    dotsContainer.classList.add('hero-dots');
    dotsContainer.setAttribute('role', 'tablist');
    dotsContainer.setAttribute('aria-label', 'Hero slides');
    
    block.appendChild(prevBtn);
    block.appendChild(nextBtn);
    block.appendChild(dotsContainer);
    
    // Get slides after creating them
    slides = Array.from(block.querySelectorAll('.hero-slide'));
  }

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
