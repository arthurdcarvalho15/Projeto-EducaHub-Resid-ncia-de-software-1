(function () {
  const professoresDemo = [
    { nome: 'Carlos Menezes', disciplina: 'Matemática', turmas: 3, diario: 'em-dia' },
    { nome: 'Helena Costa', disciplina: 'Língua Portuguesa', turmas: 4, diario: 'em-dia' },
    { nome: 'Renata Lopes', disciplina: 'História', turmas: 5, diario: 'atrasado' },
    { nome: 'Paulo Andrade', disciplina: 'Ciências', turmas: 4, diario: 'em-dia' },
    { nome: 'Mark Oliveira', disciplina: 'Língua Inglesa', turmas: 6, diario: 'atrasado' },
    { nome: 'Diego Ramos', disciplina: 'Educação Física', turmas: 6, diario: 'em-dia' },
    { nome: 'Sandra Melo', disciplina: 'Língua Portuguesa', turmas: 4, diario: 'em-dia' },
    { nome: 'João Pedro Almeida', disciplina: 'Matemática', turmas: 3, diario: 'em-dia' },
    { nome: 'André Luiz Barros', disciplina: 'Matemática', turmas: 2, diario: 'em-dia' },
    { nome: 'Beatriz Carvalho', disciplina: 'Ciências', turmas: 4, diario: 'em-dia' },
    { nome: 'Eduardo Freitas', disciplina: 'Ciências', turmas: 3, diario: 'atrasado' },
    { nome: 'Thiago Oliveira', disciplina: 'História', turmas: 4, diario: 'em-dia' },
    { nome: 'Marcos Vinícius Rocha', disciplina: 'Geografia', turmas: 4, diario: 'em-dia' },
    { nome: 'Juliana Martins', disciplina: 'Geografia', turmas: 3, diario: 'em-dia' },
    { nome: 'Camila Nascimento', disciplina: 'Língua Inglesa', turmas: 4, diario: 'em-dia' },
    { nome: 'Rafael Costa', disciplina: 'Educação Física', turmas: 3, diario: 'em-dia' },
    { nome: 'Lívia Santos', disciplina: 'Arte', turmas: 5, diario: 'em-dia' },
    { nome: 'Patrícia Gomes', disciplina: 'Ensino Religioso', turmas: 3, diario: 'em-dia' },
  ];

  document.querySelectorAll('.btn-detalhes').forEach((button) => {
    button.addEventListener('click', () => {
      const details = button.nextElementSibling;
      const expanded = button.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll(".btn-detalhes[aria-expanded='true']").forEach((openButton) => {
        if (openButton === button) return;
        openButton.setAttribute('aria-expanded', 'false');
        openButton.textContent = 'Exibir detalhes';
        openButton.nextElementSibling.hidden = true;
      });
      button.setAttribute('aria-expanded', String(!expanded));
      button.textContent = expanded ? 'Exibir detalhes' : 'Ocultar detalhes';
      details.hidden = expanded;
    });
  });
  const dadosTurmasSalvos = localStorage.getItem('educahub:gestao-turmas:v1');
  if (dadosTurmasSalvos) {
    try {
      const turmasSalvas = JSON.parse(dadosTurmasSalvos);
      turmasSalvas.forEach((turma) => {
        let card = [...document.querySelectorAll('.turma[data-turma]')].find(
          (item) => item.dataset.turma === turma.nome,
        );
        if (!card) {
          card = document.createElement('li');
          card.className = 'turma';
          card.dataset.turma = turma.nome;
          const topo = document.createElement('div');
          topo.className = 'turma-topo';
          const titulo = document.createElement('h3');
          titulo.className = 'sem-margem';
          titulo.textContent = turma.nome;
          const turno = document.createElement('span');
          turno.className = 'suave';
          turno.textContent = turma.turno;
          topo.append(titulo, turno);
          const alunos = document.createElement('p');
          alunos.className = 'turma-alunos';
          const regente = document.createElement('p');
          regente.textContent = `Regente: ${turma.regente}`;
          const salaNova = document.createElement('p');
          salaNova.dataset.field = 'sala';
          const professores = document.createElement('p');
          professores.dataset.field = 'professores';
          card.append(topo, alunos, regente, salaNova, professores);
          document.querySelector('.cartoes-turma').append(card);
        }
        const qtd = card.querySelector('.turma-alunos');
        if (qtd && typeof turma.alunos === 'number') qtd.textContent = `${turma.alunos} alunos`;
        const sala = card.querySelector("[data-field='sala']");
        if (sala) sala.textContent = turma.sala || 'Não definida';
        const atribuicoes = card.querySelector("[data-field='professores']");
        if (atribuicoes)
          atribuicoes.textContent =
            Object.entries(turma.professores ?? {})
              .map(([materia, professor]) => `${materia}: ${professor}`)
              .join(' · ') || 'Usando regente da turma';
      });
    } catch {
      /* ignora dados locais inválidos e mantém os dados demonstrativos */
    }
  }
  const chaveProfessores = 'educahub:professores-escola:v1';
  const tbody = document.querySelector('.tabela tbody');
  function carregarProfessores() {
    try {
      const salvos = JSON.parse(localStorage.getItem(chaveProfessores) ?? '[]');
      const unicos = new Map(
        [...professoresDemo, ...(Array.isArray(salvos) ? salvos : [])].map((professor) => [
          `${professor.nome}:${professor.disciplina}`,
          professor,
        ]),
      );
      return [...unicos.values()];
    } catch {
      return professoresDemo;
    }
  }
  function turmasAtribuidas(nome) {
    try {
      const turmas = JSON.parse(localStorage.getItem('educahub:gestao-turmas:v1') ?? '[]');
      return Array.isArray(turmas)
        ? turmas.filter((turma) => Object.values(turma.professores ?? {}).includes(nome)).length
        : 0;
    } catch {
      return 0;
    }
  }
  function desenharProfessores() {
    const existentes = [...tbody.rows];
    carregarProfessores().forEach((professor, indice) => {
      let row = existentes[indice];
      if (!row) {
        row = tbody.insertRow();
        const nome = document.createElement('th');
        nome.scope = 'row';
        nome.textContent = professor.nome;
        row.append(nome);
        const disciplina = row.insertCell();
        disciplina.setAttribute('data-label', 'Disciplina');
        const quantidade = row.insertCell();
        quantidade.setAttribute('data-label', 'Turmas');
        quantidade.className = 'centro numero';
        const diario = row.insertCell();
        diario.setAttribute('data-label', 'Diário');
        const statusBase = tbody.querySelector("[data-status='sucesso']");
        if (statusBase) diario.append(statusBase.cloneNode(true));
        else diario.textContent = 'Em dia';
      }
      row.cells[0].textContent = professor.nome;
      row.cells[1].textContent = (professor.disciplinas || [professor.disciplina]).join(', ');
      row.cells[1].setAttribute('data-label', 'Disciplina');
      row.cells[2].textContent = String(turmasAtribuidas(professor.nome) || professor.turmas || 0);
      row.cells[2].setAttribute('data-label', 'Turmas');
      row.cells[3].setAttribute('data-label', 'Diário');
    });
  }
  desenharProfessores();
  const dialog = document.querySelector('#dialogo-professor');
  const form = document.querySelector('#form-professor');
  document.querySelector('#abrir-professor').hidden = true;
  document.querySelector('#abrir-professor')?.addEventListener('click', () => dialog.showModal());
  document.querySelector('#cancelar-professor')?.addEventListener('click', () => dialog.close());
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const professor = {
      nome: String(data.get('nome')).trim(),
      disciplina: String(data.get('disciplina')),
    };
    const salvos = JSON.parse(localStorage.getItem(chaveProfessores) ?? '[]');
    salvos.push(professor);
    localStorage.setItem(chaveProfessores, JSON.stringify(salvos));
    desenharProfessores();
    form.reset();
    dialog.close();
  });
})();
