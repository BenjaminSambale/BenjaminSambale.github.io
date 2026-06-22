const hamburger = document.getElementById('hamburger');
const sidenav = document.querySelector('.sidenav');
const overlay = document.getElementById('nav-overlay');

hamburger.addEventListener('click', () => {
  const isOpen = sidenav.classList.toggle('open');
  overlay.classList.toggle('open', isOpen);
});

overlay.addEventListener('click', closeNav);

document.querySelectorAll('.sidenav a').forEach(a => {
  a.addEventListener('click', () => {
    show(a.id);
    closeNav();
  });
});

function show(id) {
  document.querySelectorAll('.sidenav a').forEach(n => n.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function closeNav() {
  sidenav.classList.remove('open');
  overlay.classList.remove('open');
}
