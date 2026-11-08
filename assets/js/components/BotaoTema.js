import { alternarTema, lerPreferencias } from '../scripts/preferencias.js';
function atualizarRotulos() {
  const tema = lerPreferencias().tema;
  document.querySelectorAll('[data-botao-tema]').forEach((botao) => {
    botao.setAttribute('aria-label', tema === 'claro' ? 'Ativar tema escuro' : 'Ativar tema claro');
    botao.title = tema === 'claro' ? 'Tema escuro' : 'Tema claro';
  });
}
document.querySelectorAll('[data-botao-tema]').forEach((botao) => {
  botao.addEventListener('click', () => {
    alternarTema();
    atualizarRotulos();
  });
});
document.addEventListener('preferencias-alteradas', atualizarRotulos);
atualizarRotulos();
