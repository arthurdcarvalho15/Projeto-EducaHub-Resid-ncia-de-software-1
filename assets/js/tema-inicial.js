(function () {
  var h = document.documentElement;
  var p = {};
  try {
    p = JSON.parse(localStorage.getItem('educahub:preferencias') || '{}');
  } catch (e) {
    p = {};
  }
  var sistemaEscuro =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  h.dataset.tema = p.tema || (sistemaEscuro ? 'escuro' : 'claro');
  h.dataset.espacamento = p.espacamento || 'normal';
  if (p.escala) h.style.setProperty('--escala-fonte', String(p.escala));
})();
