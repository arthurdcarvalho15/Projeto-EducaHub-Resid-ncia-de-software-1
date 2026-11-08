import { mostrarAviso } from '/assets/js/scripts/aviso.js';
import { CHAVES, ler, gravar } from '/assets/js/services/prototipo.js';

const turmaSelect = document.querySelector('#turma');
const lista = document.querySelector('.lista-chamada');
const nomesDemo = [...lista.querySelectorAll('[data-aluno]')].map((item) => item.dataset.aluno);
const painel = document.createElement('section');
painel.className = 'card prototipo-card';
painel.innerHTML = `<h2>Registro da aula e chamada</h2><div class="prototipo-form">
  <label>Data da aula <input id="data-chamada" type="date" required /></label>
  <label>Matéria <select id="materia-chamada"></select></label>
  <label>Conteúdo trabalhado <textarea id="conteudo-chamada" required></textarea></label>
  <label>Observação da turma <textarea id="obs-turma"></textarea></label></div>
  <p class="suave">Registre observações individuais na lista. A aula aparecerá no diário.</p>`;
lista.closest('section').before(painel);
const dataInput = painel.querySelector('#data-chamada');
const materiaSelect = painel.querySelector('#materia-chamada');
dataInput.value = new Date().toISOString().slice(0, 10);
for (const turma of ler(CHAVES.turmas)) {
  if (![...turmaSelect.options].some((option) => option.value === turma.nome))
    turmaSelect.add(new Option(turma.nome, turma.nome));
}
const itens = () => [...lista.querySelectorAll('[data-aluno]')];
function marcar(item, valor) {
  item
    .querySelectorAll('[data-valor]')
    .forEach((botao) => botao.setAttribute('aria-pressed', String(botao.dataset.valor === valor)));
  item.classList.toggle('faltou', valor === 'falta');
}
function contar() {
  const faltas = itens().filter((item) => item.classList.contains('faltou')).length;
  document.querySelector('#qtd-faltas').textContent = String(faltas);
  document.querySelector('#qtd-presentes').textContent = String(itens().length - faltas);
}
function montarLista() {
  const turma = ler(CHAVES.turmas).find((item) => item.nome === turmaSelect.value);
  const nomes = turma?.alunosLista || (turmaSelect.value === '8º ano B' ? nomesDemo : []);
  lista.replaceChildren(
    ...nomes.map((nome, indice) => {
      const item = document.createElement('li');
      item.className = 'aluno';
      item.dataset.aluno = nome;
      const numero = document.createElement('span');
      numero.className = 'aluno-num numero';
      numero.textContent = String(indice + 1).padStart(2, '0');
      const rotulo = document.createElement('span');
      rotulo.className = 'aluno-nome';
      rotulo.textContent = nome;
      const grupo = document.createElement('div');
      grupo.className = 'alternador';
      for (const valor of ['presente', 'falta']) {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.dataset.valor = valor;
        botao.textContent = valor === 'presente' ? 'Presente' : 'Falta';
        botao.setAttribute('aria-pressed', String(valor === 'presente'));
        botao.addEventListener('click', () => {
          marcar(item, valor);
          contar();
        });
        grupo.append(botao);
      }
      const obs = document.createElement('label');
      obs.className = 'observacao-aluno';
      obs.textContent = 'Observação do aluno';
      const input = document.createElement('input');
      input.name = 'observacao-aluno';
      input.setAttribute('aria-label', `Observação de ${nome}`);
      obs.append(input);
      item.append(numero, rotulo, grupo, obs);
      return item;
    }),
  );
  contar();
}
function restaurar() {
  const aula = ler(CHAVES.aulas).find(
    (item) =>
      item.turma === turmaSelect.value &&
      item.data === dataInput.value &&
      item.materia === materiaSelect.value,
  );
  painel.querySelector('#conteudo-chamada').value = aula?.conteudo || '';
  painel.querySelector('#obs-turma').value = aula?.observacao || '';
  for (const item of itens()) {
    const registro = aula?.alunos?.find((aluno) => aluno.nome === item.dataset.aluno);
    marcar(item, registro?.presenca || 'presente');
    item.querySelector('[name=observacao-aluno]').value = registro?.observacao || '';
  }
  contar();
}
function trocarTurma() {
  const turma = ler(CHAVES.turmas).find((item) => item.nome === turmaSelect.value);
  const materias = Object.keys(turma?.professores || {});
  materiaSelect.replaceChildren(
    ...(materias.length ? materias : ['Matemática']).map((nome) => new Option(nome, nome)),
  );
  montarLista();
  restaurar();
}
turmaSelect.addEventListener('change', trocarTurma);
materiaSelect.addEventListener('change', restaurar);
dataInput.addEventListener('change', restaurar);
document.querySelector('#todos-presentes')?.addEventListener('click', () => {
  itens().forEach((item) => marcar(item, 'presente'));
  contar();
});
document.querySelector('#salvar-chamada')?.addEventListener('click', () => {
  const conteudo = painel.querySelector('#conteudo-chamada').value.trim();
  if (!dataInput.value || !conteudo) {
    mostrarAviso('Informe a data e o conteúdo trabalhado antes de salvar.');
    painel.querySelector('#conteudo-chamada').focus();
    return;
  }
  const alunos = itens().map((item) => ({
    nome: item.dataset.aluno,
    presenca: item.classList.contains('faltou') ? 'falta' : 'presente',
    observacao: item.querySelector('[name=observacao-aluno]').value.trim(),
  }));
  const aulas = ler(CHAVES.aulas);
  const registro = {
    id: crypto.randomUUID(),
    turma: turmaSelect.value,
    materia: materiaSelect.value,
    data: dataInput.value,
    conteudo,
    observacao: painel.querySelector('#obs-turma').value.trim(),
    alunos,
  };
  const indice = aulas.findIndex(
    (aula) =>
      aula.turma === registro.turma &&
      aula.materia === registro.materia &&
      aula.data === registro.data,
  );
  if (indice < 0) aulas.push(registro);
  else {
    registro.id = aulas[indice].id;
    aulas[indice] = registro;
  }
  gravar(CHAVES.aulas, aulas);
  mostrarAviso(
    `Aula e chamada salvas: ${alunos.filter((aluno) => aluno.presenca === 'presente').length} presentes e ${alunos.filter((aluno) => aluno.presenca === 'falta').length} faltas.`,
  );
});
trocarTurma();
