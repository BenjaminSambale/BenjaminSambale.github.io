const hamburger = document.getElementById('hamburger');
const sidenav = document.querySelector('.sidenav');
const overlay = document.getElementById('nav-overlay');

hamburger.addEventListener('click', () => {
  const isOpen = sidenav.classList.toggle('open');
  overlay.classList.toggle('open', isOpen);
});

overlay.addEventListener('click', closeNav);

function closeNav() {
  sidenav.classList.remove('open');
  overlay.classList.remove('open');
}
