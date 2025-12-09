import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
    /* change to ul, li */
    const ul = document.createElement('ul');
    [...block.children].forEach((row) => {
        const li = document.createElement('li');
        while (row.firstElementChild) li.append(row.firstElementChild);
        [...li.children].forEach((div) => {
            if (div.children.length === 1 && div.querySelector('picture')) div.className = 'blog-cards-card-image';
            else {
                div.className = 'blog-cards-card-body';
                // Attempt to identify the metadata line (last paragraph)
                const paragraphs = div.querySelectorAll('p');
                if (paragraphs.length > 1) {
                    const lastP = paragraphs[paragraphs.length - 1];
                    lastP.classList.add('blog-card-meta');
                }
            }
        });
        ul.append(li);
    });
    ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
    block.replaceChildren(ul);
}
