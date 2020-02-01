let sideMenu = document.querySelector('.side-menu'),
  sideMenuMobileButton = document.querySelector('.side-menu-mobile-button'),
  sideMenuCloseIcon = document.querySelector('.side-menu-close-icon');

function openSideMenu() {
  sideMenu.classList.add('side-menu-transition', 'side-menu-visible');
  sideMenuMobileButton.classList.add('side-menu-mobile-button-hidden');
}

function closeSideMenu() {
  sideMenu.classList.remove('side-menu-visible');
  setTimeout(function () {
    if (!sideMenu.classList.contains('side-menu-visible')) {
      sideMenu.classList.remove('side-menu-transition');
    }
  }, 300);
  sideMenuMobileButton.classList.remove('side-menu-mobile-button-hidden');
}

sideMenuMobileButton.addEventListener('click', openSideMenu);
sideMenuCloseIcon.addEventListener('click', closeSideMenu);