import { cpfValidator } from '../utils/cpfValidator.js';
import { normalizarCpf } from './alunos.js';

const chave = 'educahub:pre-matricula:cpf';

export function guardarCpfPreMatricula(cpf) {
  const numeros = normalizarCpf(cpf);
  if (!cpfValidator(numeros)) throw new Error('CPF inválido.');
  sessionStorage.setItem(chave, numeros);
}

export function consumirCpfPreMatricula() {
  try {
    const cpf = sessionStorage.getItem(chave) ?? '';
    sessionStorage.removeItem(chave);
    return cpfValidator(cpf) ? normalizarCpf(cpf) : '';
  } catch {
    return '';
  }
}
