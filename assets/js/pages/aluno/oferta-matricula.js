import {
  carregarOfertas,
  escolasCompativeis,
  turnosDisponiveis,
  validarOferta,
  descreverOferta,
} from '../../services/ofertas-escolares.js';
import { definirErro } from '../../formularios.js';

export function configurarOferta(form) {
  const campos = form.elements;
  const nomes = ['anoLetivo', 'serie', 'municipioEscola', 'escola', 'turno'];
  const aviso = document.getElementById('oferta-status');
  let catalogo;
  const selecao = () => Object.fromEntries(nomes.map((nome) => [nome, campos[nome].value]));

  function opcoes(nome, itens, habilitado) {
    const campo = campos[nome];
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selecione';
    campo.replaceChildren(
      placeholder,
      ...itens.map((item) => {
        const opcao = document.createElement('option');
        opcao.value = String(item.id ?? item);
        opcao.textContent = String(item.nome ?? item);
        return opcao;
      }),
    );
    campo.value = '';
    campo.disabled = !habilitado;
    definirErro(campo, '');
  }

  function atualizarEscolas() {
    const disponiveis = escolasCompativeis(catalogo, selecao());
    const pronto = Boolean(
      campos.anoLetivo.value && campos.serie.value && campos.municipioEscola.value,
    );
    opcoes('escola', disponiveis, pronto && disponiveis.length > 0);
    opcoes('turno', [], false);
    aviso.textContent =
      pronto && !disponiveis.length
        ? 'Nenhuma escola foi encontrada para a série e o município selecionados. Altere os filtros para consultar outras opções.'
        : '';
  }

  function reiniciar() {
    catalogo = carregarOfertas();
    opcoes('anoLetivo', catalogo.anos, true);
    for (const nome of nomes.slice(1)) opcoes(nome, [], false);
    aviso.textContent = catalogo.anos.length
      ? ''
      : 'Não há anos letivos disponíveis nos registros simulados.';
  }

  campos.anoLetivo.addEventListener('change', () => {
    opcoes('serie', catalogo.series, catalogo.anos.includes(Number(campos.anoLetivo.value)));
    opcoes('municipioEscola', [], false);
    atualizarEscolas();
  });
  campos.serie.addEventListener('change', () => {
    const anterior = campos.municipioEscola.value;
    const municipios = [...new Set(catalogo.escolas.map((escola) => escola.municipio))].sort(
      (a, b) => a.localeCompare(b, 'pt-BR'),
    );
    opcoes('municipioEscola', municipios, Boolean(campos.serie.value));
    if (municipios.includes(anterior)) campos.municipioEscola.value = anterior;
    atualizarEscolas();
  });
  campos.municipioEscola.addEventListener('change', atualizarEscolas);
  campos.escola.addEventListener('change', () => {
    const turnos = turnosDisponiveis(catalogo, selecao());
    opcoes('turno', turnos, turnos.length > 0);
    aviso.textContent =
      campos.escola.value && !turnos.length
        ? 'Não existem turnos disponíveis para a opção selecionada.'
        : '';
  });

  function validar() {
    let primeiro;
    for (const nome of nomes) {
      const mensagem = campos[nome].value
        ? ''
        : 'Preencha todos os campos obrigatórios para continuar.';
      definirErro(campos[nome], mensagem);
      if (mensagem && !primeiro && !campos[nome].disabled) primeiro = campos[nome];
    }
    if (nomes.some((nome) => !campos[nome].value)) {
      primeiro?.focus();
      return false;
    }
    if (!validarOferta(carregarOfertas(), selecao())) {
      definirErro(campos.escola, 'Selecione uma escola e um turno compatíveis com os filtros.');
      campos.escola.focus();
      return false;
    }
    return true;
  }
  reiniciar();
  return {
    reiniciar,
    validar,
    selecao,
    descricao: () => descreverOferta(carregarOfertas(), selecao()),
  };
}
