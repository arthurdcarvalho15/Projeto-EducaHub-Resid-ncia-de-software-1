import { CHAVES, ler } from '/assets/js/services/prototipo.js';

const secao = document.createElement('section');
secao.className = 'card prototipo-card';
secao.innerHTML =
  '<h2>Aulas e observações registradas</h2><p class="suave">Registros demonstrativos feitos pelo professor neste navegador.</p><ul id="registros-escola"></ul>';
document.querySelector('.gestao').after(secao);
const lista = secao.querySelector('ul');
const seletor = document.querySelector('#seletor-turma');
function render() {
  lista.replaceChildren(
    ...ler(CHAVES.aulas)
      .filter((aula) => !seletor.value || aula.turma === seletor.value)
      .map((aula) => {
        const item = document.createElement('li');
        const topo = document.createElement('strong');
        topo.textContent = `${aula.data} · ${aula.turma} · ${aula.materia}`;
        const conteudo = document.createElement('p');
        conteudo.textContent = aula.conteudo;
        item.append(topo, conteudo);
        for (const aluno of aula.alunos || []) {
          if (!aluno.observacao) continue;
          const obs = document.createElement('p');
          obs.textContent = `${aluno.nome}: ${aluno.observacao}`;
          item.append(obs);
        }
        return item;
      }),
  );
  if (!lista.children.length) {
    const item = document.createElement('li');
    item.textContent = 'Nenhuma aula registrada para esta turma.';
    lista.append(item);
  }
}
seletor.addEventListener('change', render);
window.addEventListener('storage', render);
render();
