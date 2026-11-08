(function () {
  const eventos = [
    { dia: 30, mes: 10, titulo: 'Feriado — Dia do Servidor Público', tipo: 'feriado' },
    { dia: 2, mes: 11, titulo: 'Feriado — Finados', tipo: 'feriado' },
    { dia: 3, mes: 11, titulo: 'Início da rematrícula 2027', tipo: 'prazo' },
    { dia: 5, mes: 11, titulo: 'Avaliação de Matemática (8º B)', tipo: 'avaliacao' },
    { dia: 6, mes: 11, titulo: 'Entrega das autorizações do passeio', tipo: 'prazo' },
    { dia: 7, mes: 11, titulo: 'Reunião de pais e mestres', tipo: 'reuniao' },
    { dia: 12, mes: 11, titulo: 'Avaliação de Português (8º B)', tipo: 'avaliacao' },
    { dia: 13, mes: 11, titulo: 'Fim das inscrições da Feira de Ciências', tipo: 'prazo' },
    { dia: 20, mes: 11, titulo: 'Feriado — Consciência Negra', tipo: 'feriado' },
    { dia: 21, mes: 11, titulo: 'Feira de Ciências', tipo: 'evento' },
    { dia: 26, mes: 11, titulo: 'Avaliação de Ciências (8º B)', tipo: 'avaliacao' },
    { dia: 28, mes: 11, titulo: 'Fim da rematrícula 2027', tipo: 'prazo' },
  ];
  const infoEvento = {
    avaliacao: { tom: 'alerta', texto: 'Avaliação' },
    feriado: { tom: 'info', texto: 'Feriado' },
    prazo: { tom: 'perigo', texto: 'Prazo' },
    reuniao: { tom: 'neutro', texto: 'Reunião' },
    evento: { tom: 'sucesso', texto: 'Evento' },
  };

  let anoVisivel = 2026;
  let mesVisivel = 11;
  const simbolosEvento = { avaliacao: 'A', feriado: 'F', prazo: 'P', reuniao: 'R', evento: 'E' };
  const nomesMeses = new Intl.DateTimeFormat('pt-BR', { month: 'long' });
  const titulo = document.querySelector('#titulo-mes');
  const legenda = document.querySelector('.calendario caption');
  const grade = document.querySelector('#grade-calendario');
  const lista = document.querySelector('#lista-eventos');

  function renderizarCalendario() {
    const dataMes = new Date(anoVisivel, mesVisivel - 1, 1);
    const nomeMes = nomesMeses.format(dataMes);
    const nomeFormatado = `${nomeMes.charAt(0).toLocaleUpperCase('pt-BR')}${nomeMes.slice(1)} ${anoVisivel}`;
    const textoTitulo = [...titulo.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
    if (textoTitulo) textoTitulo.textContent = ` ${nomeFormatado}`;
    legenda.textContent = `Calendário de ${nomeFormatado}`;
    const subtitulo = document.querySelector('main .cabecalho-pagina p');
    if (subtitulo) subtitulo.textContent = nomeFormatado;

    const eventosMes = eventos.filter((evento) => evento.mes === mesVisivel);
    const primeiroDia = new Date(anoVisivel, mesVisivel - 1, 1).getDay();
    const quantidadeDias = new Date(anoVisivel, mesVisivel, 0).getDate();
    const celulas = [
      ...Array(primeiroDia).fill(null),
      ...Array.from({ length: quantidadeDias }, (_, indice) => indice + 1),
    ];
    while (celulas.length % 7) celulas.push(null);
    grade.replaceChildren();
    for (let indice = 0; indice < celulas.length; indice += 7) {
      const linha = document.createElement('tr');
      celulas.slice(indice, indice + 7).forEach((dia) => {
        const celula = document.createElement('td');
        if (dia === null) celula.className = 'vazio';
        else {
          const doDia = eventosMes.filter((evento) => evento.dia === dia);
          if (doDia.length) celula.classList.add('tem-evento');
          const numero = document.createElement('span');
          numero.className = 'dia numero';
          numero.textContent = dia;
          celula.append(numero);
          doDia.forEach((evento) => {
            const marca = document.createElement('span');
            marca.className = `marca marca-${evento.tipo}`;
            marca.title = evento.titulo;
            marca.setAttribute('aria-label', evento.titulo);
            marca.textContent = simbolosEvento[evento.tipo];
            celula.append(marca);
          });
        }
        linha.append(celula);
      });
      grade.append(linha);
    }

    lista.replaceChildren();
    eventosMes.forEach((evento) => {
      const item = document.createElement('li');
      const data = document.createElement('span');
      data.className = 'data-bloco';
      data.setAttribute('aria-hidden', 'true');
      const numeroDia = document.createElement('strong');
      numeroDia.textContent = String(evento.dia).padStart(2, '0');
      const mesCurto = document.createElement('span');
      mesCurto.textContent = nomeMes.slice(0, 3).toLocaleUpperCase('pt-BR');
      data.append(numeroDia, mesCurto);
      const conteudo = document.createElement('div');
      const nomeEvento = document.createElement('p');
      nomeEvento.className = 'negrito sem-margem';
      nomeEvento.textContent = evento.titulo;
      const dataAcessivel = document.createElement('span');
      dataAcessivel.className = 'sr-only';
      dataAcessivel.textContent = `${evento.dia} de ${nomeMes}.`;
      const tipo = document.createElement('span');
      tipo.className = `tipo-evento tipo-evento-${infoEvento[evento.tipo].tom}`;
      const simboloTipo = document.createElement('span');
      simboloTipo.className = 'tipo-simbolo';
      simboloTipo.setAttribute('aria-hidden', 'true');
      simboloTipo.textContent = simbolosEvento[evento.tipo];
      tipo.append(simboloTipo, document.createTextNode(infoEvento[evento.tipo].texto));
      conteudo.append(nomeEvento, dataAcessivel, tipo);
      item.append(data, conteudo);
      lista.append(item);
    });
    if (!eventosMes.length) {
      const vazio = document.createElement('li');
      vazio.textContent = 'Nenhum evento cadastrado para este mês.';
      lista.append(vazio);
    }
  }

  document.querySelector('#mes-anterior').addEventListener('click', () => {
    mesVisivel--;
    if (mesVisivel < 1) {
      mesVisivel = 12;
      anoVisivel--;
    }
    renderizarCalendario();
  });
  document.querySelector('#proximo-mes').addEventListener('click', () => {
    mesVisivel++;
    if (mesVisivel > 12) {
      mesVisivel = 1;
      anoVisivel++;
    }
    renderizarCalendario();
  });
})();
