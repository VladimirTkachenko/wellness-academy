// export function setupMenu() {
//   const dropdownIcon = document.querySelector("#dropdown-icon");
//   const submenu = document.querySelector(".submenu");
//   const mobileMenuBtn = document.querySelector(".header__mobile-menu");
//   const navList = document.querySelector(".nav__list");

//   const closeAllMenus = () => {
//     submenu?.classList.remove("show");
//     navList?.classList.remove("open");
//     document.body.classList.remove("no-scroll");
//   };

//   const handleNavLinkClick = (e) => {
//     if (e.target.classList.contains("nav__link")) {
//       closeAllMenus();
//     }
//   };

//   dropdownIcon?.addEventListener("click", (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     submenu?.classList.toggle("show");
//   });

//   navList?.addEventListener("click", (e) => {
//     const navLink = e.target.closest(".nav__link");
//     if (navLink) {
//       closeAllMenus();
//     }
//   });

//   mobileMenuBtn?.addEventListener("click", (e) => {
//     e.stopPropagation();
//     navList?.classList.toggle("open");
//     document.body.classList.toggle("no-scroll");
//   });

//   document.addEventListener("click", (e) => {
//     if (!e.target.closest(".nav")) {
//       closeAllMenus();
//     }
//   });
// }

export function setupMenu() {
  const dropdownIcon = document.querySelector('#dropdown-icon');
  const submenu = document.querySelector('.submenu');
  const mobileMenuBtn = document.querySelector('.header__mobile-menu');
  const navList = document.querySelector('.nav__list');

  dropdownIcon?.setAttribute('aria-haspopup', 'true');
  dropdownIcon?.setAttribute('aria-expanded', 'false');

  const closeAllMenus = () => {
    submenu?.classList.remove('show');
    navList?.classList.remove('open');
    document.body.classList.remove('no-scroll');
    dropdownIcon?.setAttribute('aria-expanded', 'false');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
  };

  const handleDropdownClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!submenu) return;

    submenu.classList.toggle('show');
    const isExpanded = submenu.classList.contains('show');
    dropdownIcon?.setAttribute('aria-expanded', String(isExpanded));
  };

  const handleNavClick = (e) => {
    const link = e.target.closest('.nav__link');
    if (link && !link.classList.contains('submenu')) {
      closeAllMenus();
    }
  };

  const handleMobileMenuClick = (e) => {
    e.stopPropagation();
    if (!navList) return;

    const isOpen = navList.classList.toggle('open');
    document.body.classList.toggle('no-scroll', isOpen);
    mobileMenuBtn?.setAttribute('aria-expanded', String(isOpen));
  };

  dropdownIcon?.addEventListener('click', handleDropdownClick);
  dropdownIcon?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') handleDropdownClick(e);
  });

  navList?.addEventListener('click', handleNavClick);
  mobileMenuBtn?.addEventListener('click', handleMobileMenuClick);
  mobileMenuBtn?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') handleMobileMenuClick(e);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav')) {
      closeAllMenus();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllMenus();
  });
}
