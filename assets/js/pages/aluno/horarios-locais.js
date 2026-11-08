import { CHAVES, ler } from '/assets/js/services/prototipo.js';

const secao = document.createElement('section');
secao.className = 'card prototipo-card';
secao.innerHTML = `<h2>Grade criada pela escola</h2>
  <label>Turma <select id="turma-horario-local"></select></label>
  <ul id="aulas-horario-local"></ul>`;
document.querySelector('#conteudo').append(secao);
const seletor = secao.querySelector('select');
const lista = secao.querySelector('ul');
const turmas = ler(CHAVES.turmas);
seletor.replaceChildren(...turmas.map((turma) => new Option(turma.nome, turma.nome)));
if (turmas.some((turma) => turma.nome === '8º ano B')) seletor.value = '8º ano B';
function render() {
  const turma = turmas.find((item) => item.nome === seletor.value);
  const gradeExemplo = document.querySelector('.grade-horarios');
  if (gradeExemplo) gradeExemplo.hidden = (turma?.horarios || []).length > 0;
  lista.replaceChildren(
    ...(turma?.horarios || []).map((aula) => {
      const item = document.createElement('li');
      item.textContent = `${aula.dia} ${aula.inicio}–${aula.fim} · ${aula.materia} · ${aula.professor}`;
      return item;
    }),
  );
  if (!lista.children.length) {
    const item = document.createElement('li');
    item.textContent = 'Ainda não há horários criados pela escola para esta turma.';
    lista.append(item);
  }
}
seletor.addEventListener('change', render);
render();
