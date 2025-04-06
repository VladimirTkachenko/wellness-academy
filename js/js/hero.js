function adjustHeroHeight() {
  const header = document.querySelector('.header');
  const heroElements = document.querySelectorAll('.hero, .detailed-hero');

  if (header && heroElements.length > 0) {
    const headerHeight = header.offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

    heroElements.forEach((hero) => {
      hero.style.height = '';
      hero.style.minHeight = '';
    });
  }
}

export function initHeroHeight() {
  adjustHeroHeight();
  window.addEventListener('resize', adjustHeroHeight);
}
