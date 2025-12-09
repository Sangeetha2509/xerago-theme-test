/**
 * Notification Banner Block for AEM Edge Delivery Services
 * Displays a dismissible notification banner
 */

export default function decorate(block) {
  const rows = [...block.children];

  const banner = document.createElement('div');
  banner.className = 'notification-banner-container';

  const contentRow = rows[0];
  if (!contentRow) return;

  const cells = [...contentRow.children];

  let message = '';
  let linkText = '';
  let linkUrl = '';

  // First cell = message
  if (cells[0]) {
    const messageContent = cells[0].textContent.trim();
    const parts = messageContent.split('|');
    message = parts[0] ? parts[0].trim() : messageContent;

    const link = cells[0].querySelector('a');
    if (link) {
      linkText = link.textContent.trim();
      linkUrl = link.href;
    }
  }

  // Second cell = link text or <a>
  if (cells[1] && !linkUrl) {
    const link = cells[1].querySelector('a');
    if (link) {
      linkText = link.textContent.trim();
      linkUrl = link.href;
    } else {
      linkText = cells[1].textContent.trim();
    }
  }

  // Third cell = link URL
  if (cells[2] && !linkUrl) {
    linkUrl = cells[2].textContent.trim();
  }

  // Banner content wrapper
  const bannerContent = document.createElement('div');
  bannerContent.className = 'notification-banner-content';

  const messageWrapper = document.createElement('div');
  messageWrapper.className = 'notification-banner-message';

  const messageText = document.createElement('span');
  messageText.className = 'notification-banner-text';
  messageText.textContent = message;
  messageWrapper.appendChild(messageText);

  if (linkText && linkUrl) {
    const messageLink = document.createElement('a');
    messageLink.className = 'notification-banner-link';
    messageLink.href = linkUrl;
    messageLink.textContent = linkText;

    messageWrapper.appendChild(document.createTextNode(' '));
    messageWrapper.appendChild(messageLink);
  }

  bannerContent.appendChild(messageWrapper);

  const closeButton = document.createElement('button');
  closeButton.className = 'notification-banner-close';
  closeButton.setAttribute('aria-label', 'Close notification');
  closeButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;

  closeButton.addEventListener('click', () => {
    banner.classList.add('dismissed');
    setTimeout(() => {
      banner.remove();
      sessionStorage.setItem('notificationBannerDismissed', 'true');
    }, 300);
  });

  bannerContent.appendChild(closeButton);
  banner.appendChild(bannerContent);

  block.textContent = '';
  block.appendChild(banner);

  if (sessionStorage.getItem('notificationBannerDismissed') === 'true') {
    banner.style.display = 'none';
  }

  setTimeout(() => {
    banner.classList.add('visible');
  }, 100);

  const autoDismissTime = block.dataset.autoDismiss;

  if (autoDismissTime && parseInt(autoDismissTime, 10) > 0) {
    setTimeout(() => {
      if (!banner.classList.contains('dismissed')) {
        closeButton.click();
      }
    }, parseInt(autoDismissTime, 10) * 1000);
  }
}
