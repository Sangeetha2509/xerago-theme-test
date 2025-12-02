export default function decorate(block) {
  const slides = [...block.children];
  let currentIndex = 0;

  // ---------------------------
  // 1. Create Dots First
  // ---------------------------
  const dots = createDots(slides.length);
  block.appendChild(dots);

  // ---------------------------
  // 2. Create Navigation Buttons
  // ---------------------------
  const prevBtn = createButton('prev');
  const nextBtn = createButton('next');
  block.append(prevBtn, nextBtn);

  // ---------------------------
  // 3. Update for first slide
  // ---------------------------
  updateCarousel();

  // ---------------------------
  // 4. Event Listeners
  // ---------------------------
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  });

  [...dots.children].forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });

  // ---------------------------
  // FUNCTIONS (Declared before use)
  // ---------------------------

  function createDots(count) {
    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-dots';

    for (let i = 0; i < count; i += 1) {
      const dot = document.createElement('span');
      dot.className = 'dot';
      wrapper.appendChild(dot);
    }
    return wrapper;
  }

  function createButton(type) {
    const btn = document.createElement('button');
    btn.className = `carousel-btn ${type}`;
    btn.textContent = type === 'prev' ? '‹' : '›';
    return btn;
  }

  function updateCarousel() {
    slides.forEach((slide, index) => {
      slide.style.display = index === currentIndex ? 'block' : 'none';
    });

    [...dots.children].forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }
}
