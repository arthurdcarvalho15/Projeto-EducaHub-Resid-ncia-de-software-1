export const CHAVES = {
  ano: 'educahub:ano-letivo:v1',
  turmas: 'educahub:gestao-turmas:v1',
  professores: 'educahub:professores-escola:v1',
  materias: 'educahub:materias:v1',
  aulas: 'educahub:aulas:v1',
};

export function ler(chave, padrao = []) {
  try {
    const valor = JSON.parse(localStorage.getItem(chave) ?? 'null');
    return valor ?? padrao;
  } catch {
    return padrao;
  }
}

export function gravar(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
  window.dispatchEvent(new CustomEvent('educahub:dados-atualizados', { detail: { chave } }));
}

export const diretorias = [
  ['DEA', 'Aracaju'],
  ['DRE 01', 'Estância'],
  ['DRE 02', 'Lagarto'],
  ['DRE 03', 'Itabaiana'],
  ['DRE 04', 'Japaratuba'],
  ['DRE 05', 'Nossa Senhora das Dores'],
  ['DRE 06', 'Propriá'],
  ['DRE 07', 'Gararu'],
  ['DRE 08', 'Nossa Senhora do Socorro'],
  ['DRE 09', 'Nossa Senhora da Glória'],
];
