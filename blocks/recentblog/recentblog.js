import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // block is <div class="block recentblog"> with rows from the Doc

  const ul = document.createElement('ul');

  // each row in the authoring table becomes one blog card
  [...block.children].forEach((row, index) => {
    const li = document.createElement('li');
    li.classList.add('recentblog-card');

    // move original cells into li
    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    const cells = [...li.children];

    // image cell = first cell with a picture
    const imageCell = cells.find((cell) => cell.querySelector('picture, img'));
    const textCell = cells.find((cell) => cell !== imageCell);

    if (imageCell) {
      imageCell.className = 'recentblog-card-image';

      // optimize image
      const img = imageCell.querySelector('img');
      if (img) {
        const optimized = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]);
        img.closest('picture')?.replaceWith(optimized);
      }
    }

    if (textCell) {
      textCell.className = 'recentblog-card-body';

      const paragraphs = [...textCell.querySelectorAll('p')];

      // p0 = title, p1 = meta, p2 = optional URL (from doc)
      if (paragraphs[0]) {
        paragraphs[0].classList.add('recentblog-title');
      }
      if (paragraphs[1]) {
        paragraphs[1].classList.add('recentblog-meta');
      }
      if (paragraphs[2]) {
        paragraphs[2].classList.add('recentblog-url');
      }

      // derive blog URL either from explicit URL paragraph or first link
      let blogUrl = '';
      const explicitUrl = paragraphs[2]?.textContent?.trim();
      const link = textCell.querySelector('a');

      if (explicitUrl && explicitUrl.startsWith('/')) {
        blogUrl = explicitUrl;
      } else if (link && link.href) {
        blogUrl = link.href;
      }

      if (blogUrl) {
        li.dataset.blogUrl = blogUrl;
      }
    }

    // accessibility: make card focusable and button-like
    li.setAttribute('tabindex', '0');
    li.setAttribute('role', 'button');

    // click handler + basic analytics hook
    li.addEventListener('click', () => {
      const url = li.dataset.blogUrl;
      const titleEl = li.querySelector('.recentblog-title');
      const title = titleEl ? titleEl.textContent.trim() : '';

      if (window.gtag) {
        window.gtag('event', 'blog_click', {
          event_category: 'Blog',
          event_label: title,
        });
      }

      if (url) {
        window.location.href = url;
      }
    });

    // keyboard activation
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        li.click();
      }
    });

    ul.append(li);
  });

  // animation on scroll using IntersectionObserver
  const fadeInObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('recentblog-card-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px',
  });

  [...ul.children].forEach((card, i) => {
    card.style.setProperty('--recentblog-index', i.toString());
    fadeInObserver.observe(card);
  });

  // replace original DOM with our UL
  block.replaceChildren(ul);
}
