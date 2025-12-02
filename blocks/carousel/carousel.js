export default function decorate(block) {
  const slides = [...block.children];
  let currentIndex = 0;

  // ---------------------------------------------------------
  // 1. Declare helper functions that DO NOT use 'dots' yet
  // ---------------------------------------------------------

  const createDots = (count) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-dots';

    for (let i = 0; i < count; i += 1) {
      const dot = document.createElement('span');
      dot.className = 'dot';
      wrapper.appendChild(dot);
    }
    return wrapper;
  };

  const createButton = (type) => {
    const btn = document.createElement('button');
    btn.className = `carousel-btn ${type}`;
    btn.textContent = type === 'prev' ? '‹' : '›';
    return btn;
  };

  // ---------------------------------------------------------
  // 2. Create dots FIRST before updateCarousel can use it
  // ---------------------------------------------------------

  const dots = createDots(slides.length);
  block.appendChild(dots);

  // ---------------------------------------------------------
  // 3. Now define updateCarousel (dots already exists)
  // ---------------------------------------------------------
  const updateCarousel = () => {
    slides.forEach((slide, index) => {
      slide.style.display = index === currentIndex ? 'block' : 'none';
    });

    [...dots.children].forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  };

  // ---------------------------------------------------------
  // 4. Create Buttons
  // ---------------------------------------------------------
  const prevBtn = createButton('prev');
  const nextBtn = createButton('next');
  block.append(prevBtn, nextBtn);

  updateCarousel();

  // ---------------------------------------------------------
  // 5. Events
  // ---------------------------------------------------------
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
}
