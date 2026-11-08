import { gravar, ler } from './armazenamento.js';
export const ESCALAS = [1, 1.125, 1.25, 1.375];
const PADRAO = {
  tema: 'claro',
  escala: 1,
  espacamento: 'normal',
};
export function lerPreferencias() {
  // Sem escolha salva, o tema atual é o que o script do <head> aplicou (tema do sistema)
  const temaAtual = document.documentElement.dataset.tema === 'escuro' ? 'escuro' : 'claro';
  return { ...PADRAO, tema: temaAtual, ...ler('preferencias', {}) };
}
export function aplicarPreferencias(p) {
  const html = document.documentElement;
  html.dataset.tema = p.tema;
  html.dataset.espacamento = p.espacamento;
  html.style.setProperty('--escala-fonte', String(p.escala));
}
export function salvarPreferencias(parcial) {
  const novas = { ...lerPreferencias(), ...parcial };
  gravar('preferencias', novas);
  aplicarPreferencias(novas);
  document.dispatchEvent(new CustomEvent('preferencias-alteradas', { detail: novas }));
  return novas;
}
export function alternarTema() {
  const atual = lerPreferencias().tema;
  const novo = atual === 'claro' ? 'escuro' : 'claro';
  salvarPreferencias({ tema: novo });
  return novo;
}
