'use strict';
const menu = document.getElementById('menu-lateral');
const fundo = document.querySelector('[data-fechar-menu]');
const botao = document.querySelector('[data-abrir-menu]');
function abrirMenu(abrir) {
  menu?.classList.toggle('aberto', abrir);
  if (fundo) fundo.hidden = !abrir;
  botao?.setAttribute('aria-expanded', String(abrir));
  botao?.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
  if (abrir) menu?.querySelector("a[aria-current='page'], a")?.focus();
}
botao?.addEventListener('click', () => abrirMenu(!menu?.classList.contains('aberto')));
fundo?.addEventListener('click', () => abrirMenu(false));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu?.classList.contains('aberto')) {
    abrirMenu(false);
    botao?.focus();
  }
});
