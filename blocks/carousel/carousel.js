export default function decorate(block) {
  const slides = [...block.children];
  let currentIndex = 0;

  // ---------------------------------------
  // 1. Declare all functions first (FIX)
  // ---------------------------------------

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

  const updateCarousel = () => {
    slides.forEach((slide, index) => {
      slide.style.display = index === currentIndex ? 'block' : 'none';
    });

    [...dots.children].forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  };

  // --------------------------------------------------------------------
  // 2. Now use them AFTER declaration → ESLint no-use-before-define FIXED
  // --------------------------------------------------------------------

  const dots = createDots(slides.length);
  block.appendChild(dots);

  const prevBtn = createButton('prev');
  const nextBtn = createButton('next');
  block.append(prevBtn, nextBtn);

  updateCarousel();

  // --------------------------------------------------------------------
  // 3. Events
  // --------------------------------------------------------------------

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
