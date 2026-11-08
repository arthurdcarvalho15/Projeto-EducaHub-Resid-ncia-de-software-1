import { mostrarAviso } from '/assets/js/scripts/aviso.js';
import { CHAVES, ler, gravar } from '/assets/js/services/prototipo.js';

const form = document.querySelector('#form-diario');
const lista = document.querySelector('#registros');
const turmaSelect = form.querySelector('[name=turma]');
const materiaLabel = document.createElement('label');
materiaLabel.className = 'campo';
materiaLabel.textContent = 'Matéria';
const materiaSelect = document.createElement('select');
materiaSelect.name = 'materia';
materiaLabel.append(materiaSelect);
turmaSelect.closest('.campo').after(materiaLabel);
for (const turma of ler(CHAVES.turmas)) {
  if (![...turmaSelect.options].some((option) => option.value === turma.nome))
    turmaSelect.add(new Option(turma.nome, turma.nome));
}
function materias() {
  const turma = ler(CHAVES.turmas).find((item) => item.nome === turmaSelect.value);
  const nomes = Object.keys(turma?.professores || {});
  materiaSelect.replaceChildren(
    ...(nomes.length ? nomes : ['Matemática']).map((nome) => new Option(nome, nome)),
  );
}
turmaSelect.addEventListener('change', materias);
materias();
function render() {
  const aulas = ler(CHAVES.aulas).sort((a, b) => b.data.localeCompare(a.data));
  if (!aulas.length) return;
  lista.replaceChildren(
    ...aulas.map((aula) => {
      const item = document.createElement('li');
      const topo = document.createElement('p');
      topo.className = 'registro-topo';
      const titulo = document.createElement('strong');
      titulo.textContent = `${aula.turma} · ${aula.materia}`;
      const data = document.createElement('span');
      data.className = 'suave numero';
      data.textContent = aula.data.split('-').reverse().join('/');
      topo.append(titulo, data);
      const conteudo = document.createElement('p');
      conteudo.textContent = aula.conteudo;
      const obs = document.createElement('p');
      obs.className = 'suave';
      obs.textContent = aula.observacao || 'Sem observação da turma.';
      item.append(topo, conteudo, obs);
      for (const aluno of aula.alunos || []) {
        if (!aluno.observacao) continue;
        const nota = document.createElement('p');
        nota.textContent = `${aluno.nome}: ${aluno.observacao}`;
        item.append(nota);
      }
      return item;
    }),
  );
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const dados = new FormData(form);
  const conteudo = String(dados.get('conteudo')).trim();
  const data = String(dados.get('data'));
  if (!conteudo || !data) {
    form.querySelector('#erro-conteudo').textContent = 'Informe a data e o conteúdo da aula.';
    form.querySelector('#conteudo-aula').focus();
    return;
  }
  const aulas = ler(CHAVES.aulas);
  const turma = String(dados.get('turma'));
  const materia = String(dados.get('materia'));
  const indice = aulas.findIndex(
    (aula) => aula.turma === turma && aula.materia === materia && aula.data === data,
  );
  const anterior = aulas[indice];
  const registro = {
    id: anterior?.id || crypto.randomUUID(),
    turma,
    materia,
    data,
    conteudo,
    observacao: String(dados.get('observacao')).trim(),
    alunos: anterior?.alunos || [],
  };
  if (indice < 0) aulas.push(registro);
  else aulas[indice] = registro;
  gravar(CHAVES.aulas, aulas);
  render();
  form.reset();
  materias();
  mostrarAviso('Aula registrada no diário e vinculada à chamada.');
});
render();
