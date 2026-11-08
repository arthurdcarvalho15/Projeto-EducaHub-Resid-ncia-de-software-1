import { mostrarAviso } from '/assets/js/scripts/aviso.js';
const MEDIA_MINIMA = 6;
const linhas = [...document.querySelectorAll('[data-linha]')];
const qtdLancadas = document.getElementById('qtd-lancadas');
const mediaTurma = document.getElementById('media-turma');
const fmt = (n) => n.toFixed(1).replace('.', ',');
function lerNota(input) {
  if (input.value.trim() === '') return null;
  const n = Number(input.value.replace(',', '.'));
  return Number.isFinite(n) && n >= 0 && n <= 10 ? n : 'invalida';
}
function mostrarSituacao(linha, sit) {
  linha.querySelectorAll('[data-sit]').forEach((el) => (el.hidden = el.dataset.sit !== sit));
}
function recalcular() {
  let lancadas = 0;
  const medias = [];
  linhas.forEach((linha) => {
    const anteriores = JSON.parse(linha.dataset.notas ?? '[]').filter((n) => n !== null);
    const input = linha.querySelector('input');
    const nota = lerNota(input);
    const celulaMedia = linha.querySelector('[data-media]');
    input.setAttribute('aria-invalid', String(nota === 'invalida'));
    if (nota === 'invalida') {
      mostrarSituacao(linha, 'invalida');
      return;
    }
    if (nota !== null) lancadas++;
    const todas = nota === null ? anteriores : [...anteriores, nota];
    const m = Math.round((todas.reduce((a, b) => a + b, 0) / todas.length) * 10) / 10;
    medias.push(m);
    celulaMedia.textContent = fmt(m);
    mostrarSituacao(linha, m >= MEDIA_MINIMA ? 'aprovado' : 'recuperacao');
  });
  qtdLancadas.textContent = String(lancadas);
  mediaTurma.textContent = medias.length
    ? fmt(medias.reduce((a, b) => a + b, 0) / medias.length)
    : '—';
}
linhas.forEach((l) => l.querySelector('input')?.addEventListener('input', recalcular));
recalcular();
document.getElementById('form-notas')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const invalida = linhas
    .map((l) => l.querySelector('input'))
    .find((i) => lerNota(i) === 'invalida');
  if (invalida) {
    mostrarAviso('Existe nota inválida. Use valores de 0 a 10.', 'alerta');
    invalida.focus();
    return;
  }
  mostrarAviso(`Notas salvas! ${qtdLancadas.textContent} nota(s) da 4ª unidade lançadas.`);
});
