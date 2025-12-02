export default function decorate(block) {
  const slidesData = [...block.querySelectorAll('img')];

  const slidesWrapper = document.createElement('div');
  slidesWrapper.className = 'carousel-slides';

  slidesData.forEach(slide => {
    const div = document.createElement('div');
    div.className = 'carousel-slide';
    div.append(slide);
    slidesWrapper.append(div);
  });

  block.innerHTML = '';
  block.append(slidesWrapper);

  // Dots
  const dots = document.createElement('div');
  dots.className = 'carousel-dots';

  slidesData.forEach((_, index) => {
    const dot = document.createElement('div');
    if (index === 0) dot.classList.add('active');
    dots.append(dot);

    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });

  block.append(dots);

  let currentIndex = 0;

  function updateCarousel() {
    slidesWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.querySelectorAll('div').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });
  }

  // Auto-slide
  setInterval(() => {
    currentIndex = (currentIndex + 1) % slidesData.length;
    updateCarousel();
  }, 4000);
}
