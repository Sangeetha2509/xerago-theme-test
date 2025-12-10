import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('recentblog-card');

    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    const cells = [...li.children];
    const imageCell = cells.find((cell) => cell.querySelector('picture, img'));
    const textCell = cells.find((cell) => cell !== imageCell);

    if (imageCell) {
      imageCell.className = 'recentblog-card-image';
      const img = imageCell.querySelector('img');
      if (img) {
        const optimized = createOptimizedPicture(
          img.src,
          img.alt || '',
          false,
          [{ width: '750' }],
        );
        const pic = img.closest('picture');
        if (pic) {
          pic.replaceWith(optimized);
        }
      }
    }

    if (textCell) {
      textCell.className = 'recentblog-card-body';
      const paragraphs = [...textCell.querySelectorAll('p')];

      if (paragraphs[0]) {
        paragraphs[0].classList.add('recentblog-title');
      }
      if (paragraphs[1]) {
        paragraphs[1].classList.add('recentblog-meta');
      }
      if (paragraphs[2]) {
        paragraphs[2].classList.add('recentblog-url');
      }

      let blogUrl = '';
      const explicitUrl = paragraphs[2] ? paragraphs[2].textContent.trim() : '';
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

    li.setAttribute('tabindex', '0');
    li.setAttribute('role', 'button');

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

    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        li.click();
      }
    });

    ul.append(li);
  });

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

  block.replaceChildren(ul);
}
