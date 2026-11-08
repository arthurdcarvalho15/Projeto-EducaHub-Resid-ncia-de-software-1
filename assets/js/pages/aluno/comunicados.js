import { mostrarAviso } from '/assets/js/scripts/aviso.js';
const lista = document.getElementById('lista-comunicados');
const vazio = document.getElementById('sem-comunicados');
const filtros = [...document.querySelectorAll('[data-filtro]')];
let filtro = '';
function aplicar() {
  let n = 0;
  lista.querySelectorAll('li').forEach((li) => {
    li.hidden = Boolean(filtro) && li.dataset.origem !== filtro;
    if (!li.hidden) n++;
  });
  vazio.hidden = n > 0;
}
filtros.forEach((b) =>
  b.addEventListener('click', () => {
    filtro = b.dataset.filtro ?? '';
    filtros.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    aplicar();
  }),
);
const form = document.getElementById('form-comunicado');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const dados = new FormData(form);
  const titulo = String(dados.get('titulo')).trim();
  const texto = String(dados.get('texto')).trim();
  const erro = document.getElementById('erro-com');
  if (!titulo || !texto) {
    erro.textContent = '⚠ Preencha o título e a mensagem.';
    return;
  }
  erro.textContent = '';
  const origem = form.dataset.origem ?? 'Escola';
  const modelo = document.getElementById('modelo-comunicado');
  const item = modelo.content.firstElementChild.cloneNode(true);
  item.dataset.origem = origem;
  const campo = (nome) => item.querySelector(`[data-campo='${nome}']`);
  campo('origem').textContent = origem;
  campo('origem').classList.add(`origem-${origem.toLowerCase()}`);
  campo('data').textContent = new Date().toLocaleDateString('pt-BR');
  campo('titulo').textContent = titulo;
  campo('texto').textContent = texto;
  lista.prepend(item);
  form.reset();
  form.closest('details').open = false;
  aplicar();
  mostrarAviso('Comunicado publicado!');
});
