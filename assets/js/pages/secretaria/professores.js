import { CHAVES, ler, gravar } from '/assets/js/services/prototipo.js';

const main = document.querySelector('main');
const secao = document.createElement('section');
secao.className = 'card prototipo-card';
secao.innerHTML = `
  <h2>Cadastro de professores</h2>
  <p class="suave">Dados demonstrativos salvos neste navegador. A escola poderá distribuir o professor entre matérias e turmas.</p>
  <form id="cadastro-docente" class="prototipo-form">
    <label>Nome completo <input name="nome" required /></label>
    <label>Matrícula funcional <input name="matricula" required /></label>
    <label>Formação <input name="formacao" required /></label>
    <label>Disciplinas habilitadas <input name="disciplinas" required placeholder="Ex.: Matemática, Física" /></label>
    <label>Carga horária semanal <input name="cargaHoraria" type="number" min="1" max="60" required /></label>
    <label>Contato profissional <input name="contato" type="email" /></label>
    <button class="btn btn-primario" type="submit">Adicionar professor</button>
  </form>
  <p id="docente-aviso" role="status"></p>
  <ul id="docentes-cadastrados"></ul>`;
main.append(secao);
const lista = secao.querySelector('#docentes-cadastrados');
const aviso = secao.querySelector('#docente-aviso');
function desenhar() {
  lista.replaceChildren(
    ...ler(CHAVES.professores).map((p) => {
      const item = document.createElement('li');
      item.textContent = `${p.nome} · ${p.matricula || 'sem matrícula'} · ${(p.disciplinas || [p.disciplina]).join(', ')}`;
      return item;
    }),
  );
}
secao.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  const dados = new FormData(event.currentTarget);
  const docentes = ler(CHAVES.professores);
  const matricula = String(dados.get('matricula')).trim();
  if (docentes.some((p) => p.matricula === matricula)) {
    aviso.textContent = 'Já existe um professor com esta matrícula.';
    return;
  }
  const disciplinas = String(dados.get('disciplinas'))
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (!disciplinas.length) return;
  docentes.push({
    id: crypto.randomUUID(),
    nome: String(dados.get('nome')).trim(),
    matricula,
    formacao: String(dados.get('formacao')).trim(),
    disciplinas,
    disciplina: disciplinas[0],
    cargaHoraria: Number(dados.get('cargaHoraria')),
    contato: String(dados.get('contato')).trim(),
  });
  gravar(CHAVES.professores, docentes);
  event.currentTarget.reset();
  aviso.textContent = 'Professor adicionado ao cadastro local.';
  desenhar();
});
desenhar();
