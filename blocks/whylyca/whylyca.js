export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children]);

  const items = rows.map((cols) => ({
    img: cols[0]?.querySelector('img')?.src || '',
    title: cols[1]?.textContent?.trim() || '',
    description: cols[2]?.textContent?.trim() || '',
    linkText: cols[3]?.textContent?.trim() || '',
    linkUrl: cols[4]?.textContent?.trim() || '#',
  }));

  const wrapper = document.createElement('div');
  wrapper.classList.add('whylyca-wrapper');

  const heading = document.createElement('div');
  heading.classList.add('whylyca-heading');
  heading.innerHTML = '<h2>Why Lyca?</h2>';
  wrapper.appendChild(heading);

  const grid = document.createElement('div');
  grid.classList.add('whylyca-grid');

  items.forEach((item) => {
    const card = document.createElement('div');
    card.classList.add('whylyca-card');
    const cardHtml = `
      <div class="card-content">
        <p class="text-center">
          <img src="${item.img}" class="card-image" alt="${item.title}">
        </p>
        <p class="text-center card-description">
          <strong>${item.title}</strong><br>
          ${item.description}
        </p>
        <p class="text-center">
          <a class="read-more-link" href="${item.linkUrl}">
            <span>${item.linkText}</span>
          </a>
        </p>
      </div>
    `;
    card.innerHTML = cardHtml;
    grid.appendChild(card);
  });

  wrapper.appendChild(grid);

  block.innerHTML = '';
  block.appendChild(wrapper);

  const cards = block.querySelectorAll('.whylyca-card');
  cards.forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const observerOptions = { threshold: 0.15 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = index * 150;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  cards.forEach((card) => observer.observe(card));
}
  