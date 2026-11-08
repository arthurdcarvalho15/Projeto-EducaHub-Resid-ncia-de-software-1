(function () {
  const listaTurmas = [
    {
      nome: '6º ano A',
      turno: 'Manhã',
      alunos: 34,
      regente: 'Sandra Melo',
      frequencia: 93,
      sala: '',
      professores: {},
      alunosIniciais: [
        'Lucas Gabriel Santos',
        'Alice Bezerra',
        'Ana Alves',
        'Bruno Teles',
        'Camila Meneses',
        'Daniel Batista',
        'Eduarda Prado',
        'Felipe Carvalho',
        'Gabriela Cardoso',
        'Heitor Dantas',
        'Isabela Rezende',
        'João Nunes',
        'Larissa Bezerra',
        'Matheus Vasconcelos',
        'Nicole Rocha',
        'Otávio Pereira',
        'Rafaela Ribeiro',
        'Alice Moura',
        'Davi Melo',
        'Laura Monteiro',
        'Miguel Lima',
        'Sofia Tavares',
        'Enzo Alves',
        'Valentina Teles',
        'Arthur Meneses',
        'Helena Batista',
        'Mariana Prado',
        'Pedro Carvalho',
        'Luiza Cardoso',
        'Gabriel Dantas',
        'Beatriz Rezende',
        'Lucas Nunes',
        'Manuela Bezerra',
        'Vitor Vasconcelos',
      ],
    },
    {
      nome: '6º ano B',
      turno: 'Tarde',
      alunos: 32,
      regente: 'Paulo Andrade',
      frequencia: 90,
      sala: '',
      professores: {},
      alunosIniciais: [
        'Valentina Rezende',
        'Felipe Nunes',
        'Gabriela Bezerra',
        'Heitor Vasconcelos',
        'Isabela Rocha',
        'João Pereira',
        'Larissa Ribeiro',
        'Matheus Moura',
        'Nicole Melo',
        'Otávio Monteiro',
        'Rafaela Lima',
        'Alice Tavares',
        'Davi Alves',
        'Laura Teles',
        'Miguel Meneses',
        'Sofia Batista',
        'Enzo Prado',
        'Valentina Carvalho',
        'Arthur Cardoso',
        'Helena Dantas',
        'Mariana Rezende',
        'Pedro Nunes',
        'Luiza Bezerra',
        'Gabriel Vasconcelos',
        'Beatriz Rocha',
        'Lucas Pereira',
        'Manuela Ribeiro',
        'Vitor Moura',
        'Isadora Melo',
        'Samuel Monteiro',
        'Clara Lima',
        'Caio Tavares',
      ],
    },
    {
      nome: '7º ano A',
      turno: 'Manhã',
      alunos: 33,
      regente: 'Helena Costa',
      frequencia: 92,
      sala: '',
      professores: {},
      alunosIniciais: [
        'Helena Vasconcelos',
        'Larissa Lima',
        'Matheus Tavares',
        'Nicole Alves',
        'Otávio Teles',
        'Rafaela Meneses',
        'Alice Batista',
        'Davi Prado',
        'Laura Carvalho',
        'Miguel Cardoso',
        'Sofia Dantas',
        'Enzo Rezende',
        'Valentina Nunes',
        'Arthur Bezerra',
        'Mariana Rocha',
        'Pedro Pereira',
        'Luiza Ribeiro',
        'Gabriel Moura',
        'Beatriz Melo',
        'Lucas Monteiro',
        'Manuela Lima',
        'Vitor Tavares',
        'Isadora Alves',
        'Samuel Teles',
        'Clara Meneses',
        'Caio Batista',
        'Yasmin Prado',
        'Nicolas Carvalho',
        'Melissa Cardoso',
        'Gustavo Dantas',
        'Ana Rezende',
        'Bruno Nunes',
        'Camila Bezerra',
      ],
    },
    {
      nome: '7º ano B',
      turno: 'Tarde',
      alunos: 30,
      regente: 'Renata Lopes',
      frequencia: 88,
      sala: '',
      professores: {},
      alunosIniciais: [
        'Sofia Meneses',
        'Laura Cristina Melo',
        'Alice Dantas',
        'Davi Rezende',
        'Laura Nunes',
        'Miguel Bezerra',
        'Sofia Vasconcelos',
        'Enzo Rocha',
        'Valentina Pereira',
        'Arthur Ribeiro',
        'Helena Moura',
        'Mariana Melo',
        'Pedro Monteiro',
        'Luiza Lima',
        'Gabriel Tavares',
        'Beatriz Alves',
        'Lucas Teles',
        'Manuela Meneses',
        'Vitor Batista',
        'Isadora Prado',
        'Samuel Carvalho',
        'Clara Cardoso',
        'Caio Dantas',
        'Yasmin Rezende',
        'Nicolas Nunes',
        'Melissa Bezerra',
        'Gustavo Vasconcelos',
        'Ana Rocha',
        'Bruno Pereira',
        'Camila Ribeiro',
      ],
    },
    {
      nome: '8º ano A',
      turno: 'Manhã',
      alunos: 31,
      regente: 'Carlos Menezes',
      frequencia: 94,
      sala: '',
      professores: {},
      alunosIniciais: [
        'Arthur Nogueira',
        'Enzo Melo',
        'Valentina Monteiro',
        'Arthur Lima',
        'Helena Tavares',
        'Mariana Alves',
        'Pedro Teles',
        'Luiza Meneses',
        'Gabriel Batista',
        'Beatriz Prado',
        'Lucas Carvalho',
        'Manuela Cardoso',
        'Vitor Dantas',
        'Isadora Rezende',
        'Samuel Nunes',
        'Clara Bezerra',
        'Caio Vasconcelos',
        'Yasmin Rocha',
        'Nicolas Pereira',
        'Melissa Ribeiro',
        'Gustavo Moura',
        'Ana Melo',
        'Bruno Monteiro',
        'Camila Lima',
        'Daniel Tavares',
        'Eduarda Alves',
        'Felipe Teles',
        'Gabriela Meneses',
        'Heitor Batista',
        'Isabela Prado',
        'João Carvalho',
      ],
    },
    {
      nome: '8º ano B',
      turno: 'Manhã',
      alunos: 29,
      regente: 'Mark Oliveira',
      frequencia: 89,
      sala: '',
      professores: {},
      alunosIniciais: [
        'Ana Clara Souza',
        'Pedro Carvalho',
        'Luiza Cardoso',
        'Gabriel Dantas',
        'Beatriz Rezende',
        'Lucas Nunes',
        'Manuela Bezerra',
        'Vitor Vasconcelos',
        'Isadora Rocha',
        'Samuel Pereira',
        'Clara Ribeiro',
        'Caio Moura',
        'Yasmin Melo',
        'Nicolas Monteiro',
        'Melissa Lima',
        'Gustavo Tavares',
        'Ana Alves',
        'Bruno Teles',
        'Camila Meneses',
        'Daniel Batista',
        'Eduarda Prado',
        'Felipe Carvalho',
        'Gabriela Cardoso',
        'Heitor Dantas',
        'Isabela Rezende',
        'João Nunes',
        'Larissa Bezerra',
        'Matheus Vasconcelos',
        'Nicole Rocha',
      ],
    },
    {
      nome: '9º ano A',
      turno: 'Manhã',
      alunos: 33,
      regente: 'Diego Ramos',
      frequencia: 91,
      sala: '',
      professores: {},
      alunosIniciais: [
        'Enzo Carvalho',
        'Manuela Ribeiro',
        'Vitor Moura',
        'Isadora Melo',
        'Samuel Monteiro',
        'Clara Lima',
        'Caio Tavares',
        'Yasmin Alves',
        'Nicolas Teles',
        'Melissa Meneses',
        'Gustavo Batista',
        'Ana Prado',
        'Bruno Carvalho',
        'Camila Cardoso',
        'Daniel Dantas',
        'Eduarda Rezende',
        'Felipe Nunes',
        'Gabriela Bezerra',
        'Heitor Vasconcelos',
        'Isabela Rocha',
        'João Pereira',
        'Larissa Ribeiro',
        'Matheus Moura',
        'Nicole Melo',
        'Otávio Monteiro',
        'Rafaela Lima',
        'Alice Tavares',
        'Davi Alves',
        'Laura Teles',
        'Miguel Meneses',
        'Sofia Batista',
        'Enzo Prado',
        'Valentina Carvalho',
      ],
    },
    {
      nome: '9º ano B',
      turno: 'Tarde',
      alunos: 30,
      regente: 'Lívia Santos',
      frequencia: 86,
      sala: '',
      professores: {},
      alunosIniciais: [
        'Miguel Tavares',
        'Caio Batista',
        'Yasmin Prado',
        'Nicolas Carvalho',
        'Melissa Cardoso',
        'Gustavo Dantas',
        'Ana Rezende',
        'Bruno Nunes',
        'Camila Bezerra',
        'Daniel Vasconcelos',
        'Eduarda Rocha',
        'Felipe Pereira',
        'Gabriela Ribeiro',
        'Heitor Moura',
        'Isabela Melo',
        'João Monteiro',
        'Larissa Lima',
        'Matheus Tavares',
        'Nicole Alves',
        'Otávio Teles',
        'Rafaela Meneses',
        'Alice Batista',
        'Davi Prado',
        'Laura Carvalho',
        'Miguel Cardoso',
        'Sofia Dantas',
        'Enzo Rezende',
        'Valentina Nunes',
        'Arthur Bezerra',
        'Helena Vasconcelos',
      ],
    },
  ];
  const listaProfessores = [
    { nome: 'Carlos Menezes', disciplina: 'Matemática' },
    { nome: 'Helena Costa', disciplina: 'Língua Portuguesa' },
    { nome: 'Renata Lopes', disciplina: 'História' },
    { nome: 'Paulo Andrade', disciplina: 'Ciências' },
    { nome: 'Mark Oliveira', disciplina: 'Língua Inglesa' },
    { nome: 'Diego Ramos', disciplina: 'Educação Física' },
    { nome: 'Sandra Melo', disciplina: 'Língua Portuguesa' },
    { nome: 'João Pedro Almeida', disciplina: 'Matemática' },
    { nome: 'André Luiz Barros', disciplina: 'Matemática' },
    { nome: 'Beatriz Carvalho', disciplina: 'Ciências' },
    { nome: 'Eduardo Freitas', disciplina: 'Ciências' },
    { nome: 'Thiago Oliveira', disciplina: 'História' },
    { nome: 'Marcos Vinícius Rocha', disciplina: 'Geografia' },
    { nome: 'Juliana Martins', disciplina: 'Geografia' },
    { nome: 'Camila Nascimento', disciplina: 'Língua Inglesa' },
    { nome: 'Rafael Costa', disciplina: 'Educação Física' },
    { nome: 'Lívia Santos', disciplina: 'Arte' },
    { nome: 'Patrícia Gomes', disciplina: 'Ensino Religioso' },
  ];
  const materias = [
    'Língua Portuguesa',
    'Matemática',
    'Ciências',
    'História',
    'Geografia',
    'Língua Inglesa',
    'Educação Física',
    'Arte',
    'Ensino Religioso',
  ];

  const chave = 'educahub:gestao-turmas:v1';
  const iniciais = listaTurmas.map((turma) => ({ ...turma, alunosLista: turma.alunosIniciais }));
  let turmas = carregar();
  if (!localStorage.getItem(chave)) localStorage.setItem(chave, JSON.stringify(turmas));
  const seletor = document.querySelector('#seletor-turma');
  const sala = document.querySelector('#sala-turma');
  const painel = document.querySelector('#painel-turma');
  const materiaSelect = document.querySelector('#seletor-materia');
  const professorSelect = document.querySelector('#seletor-professor');
  const campoProfessor = document.querySelector('#campo-professor');
  const atribuicoesEl = document.querySelector('#lista-atribuicoes');
  const botaoAtribuir = document.querySelector('#atribuir-professor');
  const alunosEl = document.querySelector('#lista-alunos');
  const contagem = document.querySelector('#contagem-alunos');
  const aviso = document.querySelector('#sem-alunos');
  const live = document.querySelector('#aviso-salvo');
  const destinoSelect = document.querySelector('#turma-destino');
  for (const turma of turmas) {
    for (const select of [seletor, destinoSelect]) {
      if (![...select.options].some((option) => option.value === turma.nome))
        select.add(new Option(turma.nome, turma.nome));
    }
  }
  const botaoRealocar = document.querySelector('#realocar-selecionados');
  const botaoRemoverSelecionados = document.querySelector('#remover-selecionados');
  const acoesSelecao = document.querySelector('#acoes-selecao');
  const chaveProfessores = 'educahub:professores-escola:v1';

  function professoresCadastrados() {
    try {
      const salvos = JSON.parse(localStorage.getItem(chaveProfessores) ?? '[]');
      const unicos = new Map(
        [...listaProfessores, ...(Array.isArray(salvos) ? salvos : [])].map((professor) => [
          `${professor.nome}:${professor.disciplina}`,
          professor,
        ]),
      );
      return [...unicos.values()];
    } catch {
      return listaProfessores;
    }
  }

  function carregar() {
    try {
      const guardado = localStorage.getItem(chave);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (Array.isArray(parsed))
          return parsed.map((salva) => {
            const inicial = iniciais.find((turma) => turma.nome === salva.nome);
            if (!inicial) return salva;
            const existentes = Array.isArray(salva.alunosLista)
              ? salva.alunosLista.filter((nome) => !String(nome).startsWith('Estudante '))
              : [];
            const alunosLista = [...existentes];
            const nomesExistentes = new Set(alunosLista);
            const quantidadeAlunos = Number.isFinite(salva.alunos)
              ? salva.alunos
              : inicial.alunosLista.length;
            for (const nome of inicial.alunosLista) {
              if (alunosLista.length >= quantidadeAlunos) break;
              if (!nomesExistentes.has(nome)) {
                alunosLista.push(nome);
                nomesExistentes.add(nome);
              }
            }
            salva.alunosLista = alunosLista;
            return salva;
          });
      }
    } catch {
      /* inicializa com os dados demonstrativos */
    }
    return iniciais.map((turma) => ({ ...turma, professores: {}, sala: '' }));
  }

  function salvar(mensagem) {
    localStorage.setItem(chave, JSON.stringify(turmas));
    live.textContent = mensagem;
    window.dispatchEvent(new Event('educahub:turmas-atualizadas'));
  }

  function turmaAtual() {
    return turmas.find((turma) => turma.nome === seletor.value);
  }

  function desenhar() {
    painel.hidden = !seletor.value;
    if (!seletor.value) return;
    const turma = turmaAtual();
    if (turma.sala && ![...sala.options].some((option) => option.value === turma.sala))
      sala.add(new Option(turma.sala, turma.sala));
    sala.value = turma.sala;
    [...destinoSelect.options].forEach((option) => {
      option.disabled = option.value === turma.nome;
    });
    document.querySelector('#resumo-turma').textContent =
      `${turma.turno} · ${turma.alunos} alunos matriculados · Regente: ${turma.regente}`;
    desenharAtribuicoes(turma);
    contagem.textContent = `${turma.alunosLista.length} aluno(s) nesta turma.`;
    aviso.hidden = turma.alunosLista.length > 0;
    alunosEl.replaceChildren(
      ...turma.alunosLista.map((nome) => {
        const linha = document.createElement('tr');
        const celulaSelecao = linha.insertCell();
        const selecionar = document.createElement('input');
        selecionar.type = 'checkbox';
        selecionar.value = nome;
        selecionar.className = 'selecionar-aluno';
        selecionar.setAttribute('aria-label', `Selecionar ${nome}`);
        selecionar.addEventListener('change', atualizarBotaoRealocar);
        celulaSelecao.append(selecionar);
        const celulaNome = document.createElement('th');
        celulaNome.scope = 'row';
        celulaNome.textContent = nome;
        linha.append(celulaNome);
        return linha;
      }),
    );
    atualizarBotaoRealocar();
  }

  function atualizarBotaoRealocar() {
    const selecionados = alunosEl.querySelectorAll('.selecionar-aluno:checked');
    acoesSelecao.hidden = selecionados.length === 0;
    botaoRealocar.disabled =
      selecionados.length === 0 || !destinoSelect.value || destinoSelect.value === seletor.value;
    botaoRealocar.textContent = `Realocar (${selecionados.length})`;
    botaoRemoverSelecionados.textContent = `Remover selecionados (${selecionados.length})`;
  }

  function desenharAtribuicoes(turma) {
    atribuicoesEl.replaceChildren(
      ...Object.entries(turma.professores).map(([materia, professor]) => {
        const item = document.createElement('li');
        const texto = document.createElement('span');
        texto.textContent = `${materia}: ${professor}`;
        const remover = document.createElement('button');
        remover.type = 'button';
        remover.className = 'btn btn-fantasma';
        remover.textContent = 'Remover';
        remover.addEventListener('click', () => {
          delete turma.professores[materia];
          salvar(`Professor removido de ${materia}.`);
          desenhar();
        });
        item.append(texto, remover);
        return item;
      }),
    );
  }

  seletor.addEventListener('change', desenhar);
  destinoSelect.addEventListener('change', atualizarBotaoRealocar);
  botaoRealocar.addEventListener('click', () => {
    const origem = turmaAtual();
    const destino = turmas.find((turma) => turma.nome === destinoSelect.value);
    if (!origem || !destino || destino === origem) return;
    const selecionados = [...alunosEl.querySelectorAll('.selecionar-aluno:checked')].map(
      (input) => input.value,
    );
    if (!selecionados.length) return;
    origem.alunosLista = origem.alunosLista.filter((nome) => !selecionados.includes(nome));
    origem.alunos = Math.max(0, origem.alunos - selecionados.length);
    destino.alunosLista.push(...selecionados);
    destino.alunos += selecionados.length;
    salvar(`${selecionados.length} aluno(s) realocado(s) de ${origem.nome} para ${destino.nome}.`);
    destinoSelect.value = '';
    desenhar();
  });
  botaoRemoverSelecionados.addEventListener('click', () => {
    const turma = turmaAtual();
    if (!turma) return;
    const selecionados = [...alunosEl.querySelectorAll('.selecionar-aluno:checked')].map(
      (input) => input.value,
    );
    if (!selecionados.length) return;
    turma.alunosLista = turma.alunosLista.filter((nome) => !selecionados.includes(nome));
    turma.alunos = Math.max(0, turma.alunos - selecionados.length);
    salvar(`${selecionados.length} aluno(s) removido(s) da turma ${turma.nome}.`);
    desenhar();
  });
  document.querySelector('#salvar-config')?.addEventListener('click', () => {
    const turma = turmaAtual();
    turma.sala = sala.value;
    salvar(`Configurações da turma ${turma.nome} salvas.`);
    desenhar();
  });
  materiaSelect.addEventListener('change', () => {
    campoProfessor.hidden = !materiaSelect.value;
    professorSelect.replaceChildren(new Option('Selecione o professor', ''));
    if (materiaSelect.value) {
      professoresCadastrados()
        .filter((professor) =>
          (professor.disciplinas || [professor.disciplina]).includes(materiaSelect.value),
        )
        .forEach((professor) => professorSelect.add(new Option(professor.nome, professor.nome)));
      if (professorSelect.options.length === 1)
        professorSelect.add(new Option('Nenhum professor cadastrado para esta matéria', ''));
    }
    botaoAtribuir.disabled = true;
  });
  professorSelect.addEventListener('change', () => {
    botaoAtribuir.disabled = !professorSelect.value;
  });
  botaoAtribuir.addEventListener('click', () => {
    const turma = turmaAtual();
    if (!materiaSelect.value || !professorSelect.value) return;
    turma.professores[materiaSelect.value] = professorSelect.value;
    salvar(
      `${professorSelect.value} atribuído(a) a ${materiaSelect.value} na turma ${turma.nome}.`,
    );
    materiaSelect.value = '';
    campoProfessor.hidden = true;
    professorSelect.replaceChildren(new Option('Selecione a matéria primeiro', ''));
    botaoAtribuir.disabled = true;
    desenhar();
  });
  document.querySelector('#form-aluno')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.querySelector('#nome-aluno');
    const nome = input.value.trim();
    if (!nome) return;
    const turma = turmaAtual();
    turma.alunosLista.push(nome);
    turma.alunos++;
    salvar(`${nome} adicionado(a) à turma ${turma.nome}.`);
    input.value = '';
    desenhar();
  });
  window.addEventListener('storage', (event) => {
    if (event.key === chave) {
      turmas = carregar();
      desenhar();
    }
  });
  window.addEventListener('educahub:turma-criada', (event) => {
    turmas = carregar();
    for (const select of [seletor, destinoSelect]) {
      if (![...select.options].some((option) => option.value === event.detail.nome))
        select.add(new Option(event.detail.nome, event.detail.nome));
    }
    seletor.value = event.detail.nome;
    desenhar();
  });
  desenhar();
})();
