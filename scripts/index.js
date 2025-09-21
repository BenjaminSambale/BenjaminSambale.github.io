document.querySelectorAll('.sidenav a').forEach(a => {
  a.addEventListener('click', () => { show(a.id); });
});

function show(id){
	document.querySelectorAll('.sidenav a').forEach(n=>n.classList.remove('active'))
	document.getElementById(id).classList.add('active');
}
