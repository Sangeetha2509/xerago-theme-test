export default function decorate(block) {
  const logo = block.querySelector('img');
  if (logo) {
    const logoDiv = document.createElement('div');
    logoDiv.className = 'logo';
    logoDiv.append(logo);
    block.prepend(logoDiv);
  }

  const navItems = [...block.querySelectorAll('p')];
  const nav = document.createElement('div');
  nav.className = 'nav';

  navItems.forEach(item => {
    const link = document.createElement('a');
    link.textContent = item.textContent;
    link.href = item.querySelector('a')?.href || '#';
    nav.append(link);
  });

  block.append(nav);
}
