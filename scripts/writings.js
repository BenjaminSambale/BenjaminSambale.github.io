document.querySelectorAll('.topnav a').forEach(a => {
  a.addEventListener('click', () => { show(a.id); });
});

function show(id){
  document.querySelectorAll("article").forEach(s=>s.style.display='none');
  document.getElementById(id+'-sec').style.display='block';
  document.querySelectorAll('.topnav a').forEach(n=>n.classList.remove('active'))
  document.getElementById(id).classList.add('active');
}

show('hannover')