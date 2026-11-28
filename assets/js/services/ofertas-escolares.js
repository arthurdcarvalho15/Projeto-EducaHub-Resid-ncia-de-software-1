import { ler } from '../scripts/armazenamento.js';

export const series = [
  ...[6, 7, 8, 9].map((ano) => ({
    id: `fundamental-${ano}`,
    nome: `${ano}º ano do Ensino Fundamental`,
    etapa: 'Ensino Fundamental',
  })),
  ...[1, 2, 3].map((ano) => ({
    id: `medio-${ano}`,
    nome: `${ano}ª série do Ensino Médio`,
    etapa: 'Ensino Médio',
  })),
];

const unidades = [
  [
    'jardim-mangabeiras',
    'E. E. Jardim das Mangabeiras',
    'Aracaju',
    'Ensino Fundamental',
    ['Matutino', 'Vespertino'],
  ],
  [
    'rio-sergipe',
    'Colégio Estadual Rio Sergipe',
    'Nossa Senhora do Socorro',
    'Ensino Médio',
    ['Matutino', 'Noturno'],
  ],
  ['dulce-amado', 'E. E. Professora Dulce Amado', 'Lagarto', 'Ensino Fundamental', ['Matutino']],
  ['cotinguiba', 'E. E. Vale do Cotinguiba', 'Laranjeiras', 'Ensino Fundamental', ['Vespertino']],
  [
    'caatinga-viva',
    'Colégio Estadual Caatinga Viva',
    'Nossa Senhora da Glória',
    'Ensino Médio',
    ['Integral'],
  ],
  [
    'velho-chico',
    'E. E. Foz do Velho Chico',
    'Propriá',
    'Ensino Fundamental',
    ['Matutino', 'Vespertino'],
  ],
  ['mangue-seco', 'E. E. Mangue Seco', 'Estância', 'Ensino Médio', ['Vespertino']],
  ['serra-itabaiana', 'E. E. Serra de Itabaiana', 'Itabaiana', 'Ensino Fundamental', ['Matutino']],
];
const turnosConhecidos = ['Matutino', 'Vespertino', 'Noturno', 'Integral'];

export function carregarOfertas(hoje = new Date()) {
  const atual = hoje.getFullYear();
  const configuracao = ler('ano-letivo:v1', null);
  const anos = [
    ...new Set(
      (Array.isArray(configuracao?.anos) ? configuracao.anos : [atual, atual + 1])
        .map(Number)
        .filter((ano) => Number.isInteger(ano) && ano >= 2020 && ano <= 2100),
    ),
  ].sort();
  const escolas = unidades.map(([id, nome, municipio, etapa, turnos]) => ({
    id,
    nome,
    municipio,
    ofertas: series
      .filter((serie) => serie.etapa === etapa)
      .map((serie) => ({ serie: serie.id, turnos: [...turnos] })),
  }));
  const cadastradas = ler('secretaria:escolas', []);
  if (Array.isArray(cadastradas))
    cadastradas.forEach((escola) => {
      if (
        typeof escola?.nome !== 'string' ||
        !escola.nome.trim() ||
        typeof escola.municipio !== 'string' ||
        !escola.municipio.trim() ||
        !Array.isArray(escola.etapas)
      )
        return;
      const existente = escolas.find(
        (item) => item.nome === escola.nome.trim() && item.municipio === escola.municipio.trim(),
      );
      const unidade = {
        id:
          existente?.id ??
          `cadastro-${encodeURIComponent(`${escola.nome.trim()}|${escola.municipio.trim()}`)}`,
        nome: escola.nome.trim(),
        municipio: escola.municipio.trim(),
        ofertas: series
          .filter((serie) => escola.etapas.includes(serie.etapa))
          .map((serie) => ({
            serie: serie.id,
            turnos: Array.isArray(escola.turnos)
              ? escola.turnos.filter((turno) => turnosConhecidos.includes(turno))
              : [],
          })),
      };
      if (existente) existente.ofertas = unidade.ofertas;
      else escolas.push(unidade);
    });
  return { anos, series, escolas };
}

export function escolasCompativeis(catalogo, { anoLetivo, serie, municipioEscola }) {
  if (!catalogo.anos.includes(Number(anoLetivo))) return [];
  return catalogo.escolas.filter(
    (escola) =>
      escola.municipio === municipioEscola &&
      escola.ofertas.some((oferta) => oferta.serie === serie),
  );
}

export function turnosDisponiveis(catalogo, selecao) {
  const escola = escolasCompativeis(catalogo, selecao).find((item) => item.id === selecao.escola);
  return escola?.ofertas.find((oferta) => oferta.serie === selecao.serie)?.turnos ?? [];
}

export function validarOferta(catalogo, selecao) {
  return Boolean(selecao.turno && turnosDisponiveis(catalogo, selecao).includes(selecao.turno));
}

export function descreverOferta(catalogo, selecao) {
  if (!validarOferta(catalogo, selecao))
    throw new Error('Selecione uma escola e um turno compatíveis com os filtros.');
  return {
    anoLetivo: Number(selecao.anoLetivo),
    serie: catalogo.series.find((serie) => serie.id === selecao.serie).nome,
    municipio: selecao.municipioEscola,
    escola: catalogo.escolas.find((escola) => escola.id === selecao.escola).nome,
    turno: selecao.turno,
  };
}
