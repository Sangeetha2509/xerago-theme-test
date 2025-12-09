/**
 * Notification Banner Block for AEM Edge Delivery Services
 * Displays a dismissible notification banner like Lycamobile design
 */

export default function decorate(block) {
  // Extract content from block
  const rows = [...block.children];
  
  // Create banner container
  const banner = document.createElement('div');
  banner.className = 'notification-banner-container';
  
  // Get content from first row
  const contentRow = rows[0];
  if (!contentRow) return;
  
  const cells = [...contentRow.children];
  
  // Extract message and link from cells
  let message = '';
  let linkText = '';
  let linkUrl = '';
  
  // First cell contains the message
  if (cells[0]) {
    const messageContent = cells[0].textContent.trim();
    // Split message and link if they're in the same cell
    const parts = messageContent.split('|');
    message = parts[0]?.trim() || messageContent;
    
    // Check if there's a link in the cell
    const link = cells[0].querySelector('a');
    if (link) {
      linkText = link.textContent.trim();
      linkUrl = link.href;
    }
  }
  
  // Second cell contains link (if not in first cell)
  if (cells[1] && !linkUrl) {
    const link = cells[1].querySelector('a');
    if (link) {
      linkText = link.textContent.trim();
      linkUrl = link.href;
    } else {
      linkText = cells[1].textContent.trim();
    }
  }
  
  // Third cell contains link URL (if provided separately)
  if (cells[2] && !linkUrl) {
    linkUrl = cells[2].textContent.trim();
  }
  
  // Create banner content
  const bannerContent = document.createElement('div');
  bannerContent.className = 'notification-banner-content';
  
  // Create message wrapper
  const messageWrapper = document.createElement('div');
  messageWrapper.className = 'notification-banner-message';
  
  // Add message text
  const messageText = document.createElement('span');
  messageText.className = 'notification-banner-text';
  messageText.textContent = message;
  messageWrapper.appendChild(messageText);
  
  // Add link if provided
  if (linkText && linkUrl) {
    const messageLink = document.createElement('a');
    messageLink.className = 'notification-banner-link';
    messageLink.href = linkUrl;
    messageLink.textContent = linkText;
    messageWrapper.appendChild(document.createTextNode(' '));
    messageWrapper.appendChild(messageLink);
  }
  
  // Add message to content
  bannerContent.appendChild(messageWrapper);
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'notification-banner-close';
  closeButton.setAttribute('aria-label', 'Close notification');
  closeButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
  
  // Add close functionality
  closeButton.addEventListener('click', () => {
    banner.classList.add('dismissed');
    setTimeout(() => {
      banner.remove();
      // Store dismissal in session storage
      sessionStorage.setItem('notificationBannerDismissed', 'true');
    }, 300);
  });
  
  // Add elements to banner
  bannerContent.appendChild(closeButton);
  banner.appendChild(bannerContent);
  
  // Clear block and add banner
  block.textContent = '';
  block.appendChild(banner);
  
  // Check if banner was previously dismissed in this session
  if (sessionStorage.getItem('notificationBannerDismissed') === 'true') {
    banner.style.display = 'none';
  }
  
  // Add entrance animation
  setTimeout(() => {
    banner.classList.add('visible');
  }, 100);
  
  // Optional: Auto-dismiss after X seconds
  const autoDismissTime = block.dataset.autoDismiss;
  if (autoDismissTime && parseInt(autoDismissTime) > 0) {
    setTimeout(() => {
      if (!banner.classList.contains('dismissed')) {
        closeButton.click();
      }
    }, parseInt(autoDismissTime) * 1000);
  }
}
