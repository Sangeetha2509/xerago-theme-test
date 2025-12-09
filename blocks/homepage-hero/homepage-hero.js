// homepage-hero.js - Fully ESLint clean

import { createOptimizedPicture } from '../../scripts/aem.js';

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

  // Check if slides already exist (from .plain.html template)
  let slides = Array.from(block.querySelectorAll('.hero-slide'));

  // If slides exist, skip parsing
  if (slides.length > 0) {
    // Continue with carousel setup below
  } else {
    // Try multiple parsing strategies
    // Strategy 1: Direct children (most common for AEM blocks)
    let rows = Array.from(block.children).filter((child) => child.tagName === 'DIV');
    let dataRows = rows.slice(1); // Skip header row

    // Strategy 2: If no direct children, try querySelectorAll
    if (rows.length === 0) {
      rows = Array.from(block.querySelectorAll(':scope > div'));
      dataRows = rows.slice(1);
    }

    // Strategy 3: Check if content is in a table element
    const table = block.querySelector('table');
    if (table && rows.length === 0) {
      const tableRows = Array.from(table.querySelectorAll('tr'));
      if (tableRows.length > 1) {
        dataRows = tableRows.slice(1).map((tr) => {
          const cols = Array.from(tr.querySelectorAll('td, th'));
          const rowDiv = document.createElement('div');
          cols.forEach((col) => {
            const colDiv = document.createElement('div');
            colDiv.textContent = col.textContent.trim();
            rowDiv.appendChild(colDiv);
          });
          return rowDiv;
        });
      }
    }

    // Strategy 3b: Check if content is in a <pre> tag (common for plain text)
    const pre = block.querySelector('pre');
    if (pre && rows.length === 0 && dataRows.length === 0) {
      const preText = pre.textContent || '';
      const lines = preText.split('\n').map((line) => line.trim()).filter((line) => line && line.includes(','));
      if (lines.length > 1) {
        // Convert to row structure
        dataRows = lines.slice(1).map((line) => {
          const values = line.split(',').map((v) => v.trim());
          const rowDiv = document.createElement('div');
          values.forEach((value) => {
            const colDiv = document.createElement('div');
            colDiv.textContent = value;
            rowDiv.appendChild(colDiv);
          });
          return rowDiv;
        });
      }
    }

    // Parse the data rows we found
    if (dataRows.length > 0) {
      const heroTrack = document.createElement('div');
      heroTrack.classList.add('hero-track');

      dataRows.forEach((row) => {
        // Try to get columns from the row
        let cols = Array.from(row.children).filter((child) => child.tagName === 'DIV');
        if (cols.length === 0) {
          cols = Array.from(row.querySelectorAll(':scope > div'));
        }
        // If still no cols, treat the row itself as having text content
        if (cols.length === 0 && row.textContent) {
          // Try parsing as CSV text
          const rowText = row.textContent.trim();
          if (rowText.includes(',')) {
            const values = rowText.split(',').map((v) => v.trim());
            if (values.length >= 8) {
              const slideOrder = values[1] || '';
              const title = values[2] || '';
              const subtitle = values[3] || '';
              const ctaLabel = values[4] || '';
              const ctaLink = values[5] || '';
              const bgDesktop = values[6] || '';
              const bgMobile = values[7] || '';

              const slide = createSlide(slideOrder, title, subtitle, ctaLabel, ctaLink, bgDesktop, bgMobile);
              heroTrack.appendChild(slide);
            }
          }
        } else if (cols.length >= 8) {
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

      if (heroTrack.children.length > 0) {
        // Clear block and add new structure
        block.innerHTML = '';
        block.appendChild(heroTrack);
        addControls(block);
        slides = Array.from(block.querySelectorAll('.hero-slide'));
      }
    }

    // Strategy 4: If still no slides, try parsing as plain text CSV
    if (slides.length === 0) {
      // Get text content - try multiple methods
      let blockText = block.textContent || block.innerText || '';
      // If blockText is empty, try getting from innerHTML
      if (!blockText || blockText.trim().length === 0) {
        blockText = block.innerHTML || '';
        // Remove HTML tags if any
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = blockText;
        blockText = tempDiv.textContent || tempDiv.innerText || '';
      }

      const lines = blockText.split('\n').map((line) => line.trim()).filter((line) => line && line.includes(','));
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
