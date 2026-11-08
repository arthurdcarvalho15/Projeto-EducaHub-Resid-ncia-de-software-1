import { CHAVES, ler } from '/assets/js/services/prototipo.js';

const secao = document.createElement('section');
secao.className = 'card prototipo-card';
secao.innerHTML =
  '<h2>Observações de aula</h2><p class="suave">Registros demonstrativos dos alunos vinculados a este perfil.</p><ul></ul>';
document.querySelector('#conteudo').append(secao);
const lista = secao.querySelector('ul');
const filhos = ['Ana Clara Souza', 'Pedro Souza'];
function render() {
  const observacoes = ler(CHAVES.aulas).flatMap((aula) =>
    (aula.alunos || [])
      .filter((aluno) => filhos.includes(aluno.nome) && aluno.observacao)
      .map((aluno) => ({ aula, aluno })),
  );
  lista.replaceChildren(
    ...observacoes.map(({ aula, aluno }) => {
      const item = document.createElement('li');
      item.textContent = `${aula.data} · ${aula.materia} · ${aluno.nome}: ${aluno.observacao}`;
      return item;
    }),
  );
  if (!lista.children.length) {
    const item = document.createElement('li');
    item.textContent = 'Nenhuma observação registrada.';
    lista.append(item);
  }
}
window.addEventListener('storage', render);
render();
