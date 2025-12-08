export default function decorate(block) {
  const slides = [...block.querySelectorAll(':scope > div')];

  const wrapper = document.createElement('div');
  wrapper.classList.add('carousel-wrapper');

  slides.forEach((slide) => {
    slide.classList.add('carousel-slide');
    wrapper.appendChild(slide);
  });

  block.innerHTML = '';
  block.appendChild(wrapper);

  const dots = document.createElement('div');
  dots.classList.add('carousel-dots');

  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.dataset.index = i;
    dots.appendChild(dot);
  });

  block.appendChild(dots);

  let index = 0;
  const total = slides.length;

  function showSlide(i) {
    wrapper.style.transform = `translateX(-${i * 100}%)`;
    dots.querySelectorAll('.dot').forEach((d) => d.classList.remove('active'));
    dots.querySelector(`.dot[data-index="${i}"]`).classList.add('active');
    index = i;
  }

  const auto = setInterval(() => {
    index = (index + 1) % total;
    showSlide(index);
  }, 4000);

  dots.addEventListener('click', (e) => {
    if (e.target.classList.contains('dot')) {
      clearInterval(auto);
      showSlide(Number(e.target.dataset.index));
    }
  });

  let startX = 0;
  wrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  wrapper.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50) {
      showSlide((index + 1) % total);
    } else if (diff < -50) {
      showSlide((index - 1 + total) % total);
    }
  });
}
