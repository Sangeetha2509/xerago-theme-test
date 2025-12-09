// homepage-hero.js - Fully ESLint clean

// Helper function to create a slide element
function createSlide(slideOrder, title, subtitle, ctaLabel, ctaLink, bgDesktop, bgMobile) {
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

  return slide;
}

// Helper function to add navigation controls
function addControls(block) {
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
}

export default function decorate(block) {
  if (!block) return;

  // Helper function to extract text from a cell (handles <p> tags)
  const getCellText = (cell) => {
    if (!cell) return '';
    const p = cell.querySelector('p');
    return (p ? p.textContent : cell.textContent || '').trim();
  };

  // Parse table structure from Google Docs
  // The block will have rows like: header row, then data rows
  const rows = Array.from(block.querySelectorAll(':scope > div'));

  // Skip header row (first row) and parse data rows
  const dataRows = rows.slice(1);

  // If no data rows, check if slides already exist (from .plain.html template)
  let slides = Array.from(block.querySelectorAll('.hero-slide'));

  // If no slides and no structured rows, try parsing as plain text CSV
  if (slides.length === 0 && dataRows.length === 0) {
    const blockText = block.textContent || '';
    const lines = blockText.split('\n').map((line) => line.trim()).filter((line) => line);
    if (lines.length > 1) {
      // Parse CSV lines
      const csvRows = lines.slice(1).map((line) => {
        // Simple CSV parsing (handles quoted values)
        const values = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i += 1) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim());
        return values;
      });

      if (csvRows.length > 0 && csvRows[0].length >= 8) {
        const heroTrack = document.createElement('div');
        heroTrack.classList.add('hero-track');

        csvRows.forEach((row) => {
          if (row.length >= 8) {
            const slideOrder = row[1] || '';
            const title = row[2] || '';
            const subtitle = row[3] || '';
            const ctaLabel = row[4] || '';
            const ctaLink = row[5] || '';
            const bgDesktop = row[6] || '';
            const bgMobile = row[7] || '';

            const slide = createSlide(slideOrder, title, subtitle, ctaLabel, ctaLink, bgDesktop, bgMobile);
            heroTrack.appendChild(slide);
          }
        });

        block.innerHTML = '';
        block.appendChild(heroTrack);
        addControls(block);
        slides = Array.from(block.querySelectorAll('.hero-slide'));
      }
    }
  }

  if (slides.length === 0 && dataRows.length > 0) {
    // Parse CSV-like structure from table rows
    const heroTrack = document.createElement('div');
    heroTrack.classList.add('hero-track');

    dataRows.forEach((row) => {
      const cols = Array.from(row.querySelectorAll(':scope > div'));
      if (cols.length >= 8) {
        // Extract data from columns (skip first column which is "homepage-hero")
        const slideOrder = getCellText(cols[1]);
        const title = getCellText(cols[2]);
        const subtitle = getCellText(cols[3]);
        const ctaLabel = getCellText(cols[4]);
        const ctaLink = getCellText(cols[5]);
        const bgDesktop = getCellText(cols[6]);
        const bgMobile = getCellText(cols[7]);

        const slide = createSlide(slideOrder, title, subtitle, ctaLabel, ctaLink, bgDesktop, bgMobile);
        heroTrack.appendChild(slide);
      }
    });

    // Clear block and add new structure
    block.innerHTML = '';
    block.appendChild(heroTrack);
    addControls(block);

    // Get slides after creating them
    slides = Array.from(block.querySelectorAll('.hero-slide'));
  }

  if (!slides.length) return;

  // lazy background load
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

  // 🟢 FIX: Declare dots BEFORE using inside goTo()
  const dotsContainer = block.querySelector('.hero-dots');
  const dots = [];

  // ---- functions declared AFTER variables are available ----

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

  // create dots
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
  const nextBtn = block.querySelector('.hero-nav--next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prev();
      restartTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      next();
      restartTimer();
    });
  }

  // swipe
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

  // keyboard
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
