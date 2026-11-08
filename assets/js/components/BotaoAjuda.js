import { falar, pararFala, textoDoElemento, vozDisponivel } from '../scripts/voz.js';
const dialogo = document.getElementById('ajuda-dialogo');
const abrir = document.getElementById('ajuda-abrir');
const status = document.getElementById('ajuda-status');
const faixa = document.getElementById('faixa-leitura');
const botaoModo = dialogo?.querySelector("[data-acao='modo-clique']");
let modoClique = false;
let destacado = null;
const informar = (msg) => {
  if (status) status.textContent = msg;
};
function limparDestaque() {
  destacado?.classList.remove('lendo-agora');
  destacado = null;
}
function lerComAviso(texto) {
  if (!vozDisponivel()) {
    informar(
      'Seu navegador não tem leitura em voz alta. Tente o Google Chrome ou o Microsoft Edge.',
    );
    return;
  }
  falar(texto, limparDestaque);
  informar('Lendo em voz alta…');
}
function definirModoClique(ligado) {
  modoClique = ligado;
  document.body.classList.toggle('modo-clique', ligado);
  botaoModo?.setAttribute('aria-pressed', String(ligado));
  if (faixa) faixa.hidden = !ligado;
  if (!ligado) {
    pararFala();
    limparDestaque();
  }
}
abrir?.addEventListener('click', () => {
  informar('');
  dialogo?.showModal();
});
dialogo?.addEventListener('click', (evento) => {
  // clicar no fundo escuro (fora da caixa) fecha o diálogo
  if (evento.target === dialogo) {
    const r = dialogo.getBoundingClientRect();
    const fora =
      evento.clientX < r.left ||
      evento.clientX > r.right ||
      evento.clientY < r.top ||
      evento.clientY > r.bottom;
    if (fora) dialogo.close();
    return;
  }
  const botao = evento.target.closest('[data-acao]');
  if (!botao) return;
  switch (botao.dataset.acao) {
    case 'fechar':
      dialogo.close();
      break;
    case 'ouvir-explicacao':
      lerComAviso(document.getElementById('ajuda-texto')?.textContent ?? '');
      break;
    case 'ler-pagina': {
      const principal = document.querySelector('main');
      if (principal) lerComAviso(textoDoElemento(principal));
      break;
    }
    case 'modo-clique':
      definirModoClique(!modoClique);
      if (modoClique) dialogo.close();
      break;
    case 'parar':
      pararFala();
      limparDestaque();
      informar('Leitura parada.');
      break;
  }
});
faixa
  ?.querySelector("[data-acao='desligar-clique']")
  ?.addEventListener('click', () => definirModoClique(false));
// Modo "clique para ouvir": intercepta o clique e lê o elemento
const LEGIVEIS =
  '[aria-description], h1, h2, h3, h4, p, li, td, th, label, button, a, figcaption, dt, dd, .status, .materia, legend';
document.addEventListener(
  'click',
  (evento) => {
    if (!modoClique) return;
    const alvo = evento.target;
    if (alvo.closest('#faixa-leitura, #ajuda-dialogo, #ajuda-abrir')) return;
    const elemento = alvo.closest(LEGIVEIS);
    if (!elemento) return;
    evento.preventDefault();
    evento.stopPropagation();
    limparDestaque();
    destacado = elemento;
    elemento.classList.add('lendo-agora');
    lerComAviso(textoDoElemento(elemento));
  },
  true,
);
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && modoClique) definirModoClique(false);
});
