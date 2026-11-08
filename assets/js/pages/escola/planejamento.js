import { CHAVES, ler, gravar } from '/assets/js/services/prototipo.js';

const gestao = document.querySelector('.gestao');
const secao = document.createElement('section');
secao.className = 'card prototipo-card';
secao.innerHTML = `
  <h2>Planejamento do ano letivo</h2>
  <div class="prototipo-form">
    <label>Ano letivo ativo <select id="ano-ativo"></select></label>
    <form id="criar-ano" class="prototipo-form-inline">
      <label>Criar ano letivo <input name="ano" type="number" min="2020" max="2100" required /></label>
      <button class="btn btn-secundario" type="submit">Criar ano</button>
    </form>
  </div>
  <form id="criar-turma" class="prototipo-form">
    <h3>Criar turma</h3>
    <label>Série/identificação <input name="nome" placeholder="Ex.: 6º ano C" required /></label>
    <label>Turno <select name="turno" required><option value="">Selecione</option><option>Matutino</option><option>Vespertino</option><option>Noturno</option><option>Integral</option></select></label>
    <label>Sala <input name="sala" required /></label>
    <label>Professor regente <input name="regente" required /></label>
    <button class="btn btn-primario" type="submit">Criar turma</button>
  </form>
  <form id="criar-materia" class="prototipo-form">
    <h3>Informações da matéria</h3>
    <label>Matéria <input name="nome" required /></label>
    <label>Carga horária semanal (aulas) <input name="aulasSemana" type="number" min="1" max="40" required /></label>
    <label>Descrição/objetivos <textarea name="descricao"></textarea></label>
    <button class="btn btn-secundario" type="submit">Salvar matéria</button>
  </form>
  <ul id="materias-planejadas"></ul>
  <p id="planejamento-aviso" role="status"></p>
  <button id="encerrar-ano" class="btn btn-secundario" type="button">Finalizar ano letivo</button>
  <p id="encerramento-aviso" role="status" hidden>O cálculo de resultados, a promoção de alunos e a preparação das turmas do ano seguinte ainda não estão disponíveis neste protótipo. Nenhum registro foi alterado.</p>`;
gestao.before(secao);
const aviso = secao.querySelector('#planejamento-aviso');
const anoSelect = secao.querySelector('#ano-ativo');
function anos() {
  return ler(CHAVES.ano, { anos: [2026], ativo: 2026 });
}
function renderAnos() {
  const dados = anos();
  anoSelect.replaceChildren(...dados.anos.map((ano) => new Option(String(ano), String(ano))));
  anoSelect.value = String(dados.ativo);
}
renderAnos();
anoSelect.addEventListener('change', () =>
  gravar(CHAVES.ano, { ...anos(), ativo: Number(anoSelect.value) }),
);
secao.querySelector('#criar-ano').addEventListener('submit', (event) => {
  event.preventDefault();
  const ano = Number(new FormData(event.currentTarget).get('ano'));
  const dados = anos();
  if (dados.anos.includes(ano)) {
    aviso.textContent = 'Este ano já foi criado.';
    return;
  }
  gravar(CHAVES.ano, { anos: [...dados.anos, ano].sort(), ativo: ano });
  event.currentTarget.reset();
  renderAnos();
  aviso.textContent = `Ano letivo ${ano} criado.`;
});
secao.querySelector('#criar-turma').addEventListener('submit', (event) => {
  event.preventDefault();
  const dados = new FormData(event.currentTarget);
  const ano = Number(anoSelect.value);
  const identificacao = String(dados.get('nome')).trim();
  const nome = ano === 2026 ? identificacao : `${identificacao} · ${ano}`;
  const turmas = ler(CHAVES.turmas);
  if (
    turmas.some((turma) => turma.nome.toLocaleLowerCase() === nome.toLocaleLowerCase()) ||
    [...document.querySelector('#seletor-turma').options].some(
      (option) => option.value.toLocaleLowerCase() === nome.toLocaleLowerCase(),
    )
  ) {
    aviso.textContent = 'Já existe uma turma com esta identificação neste ano.';
    return;
  }
  turmas.push({
    nome,
    ano,
    turno: String(dados.get('turno')),
    sala: String(dados.get('sala')).trim(),
    regente: String(dados.get('regente')).trim(),
    alunos: 0,
    alunosLista: [],
    professores: {},
    horarios: [],
    frequencia: 0,
  });
  gravar(CHAVES.turmas, turmas);
  window.dispatchEvent(new CustomEvent('educahub:turma-criada', { detail: { nome } }));
  event.currentTarget.reset();
  aviso.textContent = `Turma ${nome} criada.`;
});
function renderMaterias() {
  const lista = secao.querySelector('#materias-planejadas');
  const seletorMateria = document.querySelector('#seletor-materia');
  for (const materia of ler(CHAVES.materias)) {
    if (![...seletorMateria.options].some((option) => option.value === materia.nome))
      seletorMateria.add(new Option(materia.nome, materia.nome));
  }
  lista.replaceChildren(
    ...ler(CHAVES.materias).map((materia) => {
      const item = document.createElement('li');
      item.textContent = `${materia.nome} · ${materia.aulasSemana} aula(s) por semana${materia.descricao ? ` · ${materia.descricao}` : ''}`;
      return item;
    }),
  );
}
secao.querySelector('#criar-materia').addEventListener('submit', (event) => {
  event.preventDefault();
  const dados = new FormData(event.currentTarget);
  const nome = String(dados.get('nome')).trim();
  const materias = ler(CHAVES.materias);
  const materia = {
    nome,
    aulasSemana: Number(dados.get('aulasSemana')),
    descricao: String(dados.get('descricao')).trim(),
  };
  const indice = materias.findIndex(
    (item) => item.nome.toLocaleLowerCase() === nome.toLocaleLowerCase(),
  );
  if (indice < 0) materias.push(materia);
  else materias[indice] = materia;
  gravar(CHAVES.materias, materias);
  event.currentTarget.reset();
  renderMaterias();
  aviso.textContent = `Informações de ${nome} salvas.`;
});
renderMaterias();
secao.querySelector('#encerrar-ano').addEventListener('click', () => {
  secao.querySelector('#encerramento-aviso').hidden = false;
});

const horario = document.createElement('section');
horario.className = 'card prototipo-card';
horario.innerHTML = `<h2>Horário da turma</h2>
  <p class="suave">Selecione uma turma acima e monte sua grade manualmente.</p>
  <form id="form-horario" class="prototipo-form">
    <label>Dia <select name="dia" required><option>Segunda</option><option>Terça</option><option>Quarta</option><option>Quinta</option><option>Sexta</option></select></label>
    <label>Início <input name="inicio" type="time" required /></label>
    <label>Fim <input name="fim" type="time" required /></label>
    <label>Matéria <select name="materia" required></select></label>
    <button type="submit" class="btn btn-secundario">Adicionar aula à grade</button>
  </form><p id="horario-aviso" role="status"></p><ul id="grade-turma"></ul>`;
gestao.after(horario);
const turmaSelect = document.querySelector('#seletor-turma');
const materiaSelect = horario.querySelector('[name=materia]');
const grade = horario.querySelector('#grade-turma');
const horarioAviso = horario.querySelector('#horario-aviso');
function renderGrade() {
  const turma = ler(CHAVES.turmas).find((item) => item.nome === turmaSelect.value);
  materiaSelect.replaceChildren(
    new Option('Selecione', ''),
    ...Object.keys(turma?.professores || {}).map((nome) => new Option(nome, nome)),
  );
  grade.replaceChildren(
    ...(turma?.horarios || []).map((aula) => {
      const item = document.createElement('li');
      const texto = document.createElement('span');
      texto.textContent = `${aula.dia} ${aula.inicio}–${aula.fim} · ${aula.materia} · ${aula.professor}`;
      const remover = document.createElement('button');
      remover.type = 'button';
      remover.className = 'btn btn-fantasma';
      remover.textContent = 'Remover';
      remover.addEventListener('click', () => {
        const turmas = ler(CHAVES.turmas);
        const alvo = turmas.find((t) => t.nome === turma.nome);
        alvo.horarios = alvo.horarios.filter((item) => item.id !== aula.id);
        gravar(CHAVES.turmas, turmas);
        renderGrade();
      });
      item.append(texto, remover);
      return item;
    }),
  );
}
turmaSelect.addEventListener('change', renderGrade);
window.addEventListener('educahub:dados-atualizados', (event) => {
  if (event.detail.chave === CHAVES.turmas) renderGrade();
});
window.addEventListener('educahub:turma-criada', renderGrade);
window.addEventListener('educahub:turmas-atualizadas', renderGrade);
horario.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  const dados = new FormData(event.currentTarget);
  const turmas = ler(CHAVES.turmas);
  const turma = turmas.find((item) => item.nome === turmaSelect.value);
  if (!turma) {
    horarioAviso.textContent = 'Selecione uma turma.';
    return;
  }
  const aula = {
    id: crypto.randomUUID(),
    dia: String(dados.get('dia')),
    inicio: String(dados.get('inicio')),
    fim: String(dados.get('fim')),
    materia: String(dados.get('materia')),
  };
  aula.professor = turma.professores[aula.materia];
  if (!aula.professor || aula.inicio >= aula.fim) {
    horarioAviso.textContent = 'Confira a matéria e os horários.';
    return;
  }
  const conflito = turmas.some((t) =>
    (t.horarios || []).some(
      (h) =>
        h.dia === aula.dia &&
        h.inicio < aula.fim &&
        aula.inicio < h.fim &&
        (t.nome === turma.nome ||
          h.professor === aula.professor ||
          (t.sala && t.sala === turma.sala)),
    ),
  );
  if (conflito) {
    horarioAviso.textContent = 'Conflito de turma, professor ou sala neste horário.';
    return;
  }
  (turma.horarios ||= []).push(aula);
  gravar(CHAVES.turmas, turmas);
  event.currentTarget.reset();
  renderGrade();
  horarioAviso.textContent = 'Aula adicionada à grade.';
});
renderGrade();
