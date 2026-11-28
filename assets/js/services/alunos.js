import { ler } from '../scripts/armazenamento.js';
import { cpfValidator } from '../utils/cpfValidator.js';

const chave = 'educahub:alunos:v1';
export const normalizarCpf = (cpf) => String(cpf ?? '').replace(/\D/g, '');

function registros() {
  if (localStorage.getItem(chave) === null) return [];
  const alunos = ler('alunos:v1', null);
  if (!Array.isArray(alunos)) throw new Error('Registros de alunos indisponíveis.');
  return alunos;
}

export function alunoCadastrado(cpf) {
  const numeros = normalizarCpf(cpf);
  return (
    cpfValidator(numeros) && registros().some((aluno) => normalizarCpf(aluno?.cpf) === numeros)
  );
}

export function registrarPreMatricula(cpf, solicitacao) {
  if (!cpfValidator(String(cpf))) throw new Error('CPF inválido.');
  const alunos = registros();
  if (alunoCadastrado(cpf)) return false;
  const aluno = { cpf: normalizarCpf(cpf) };
  if (solicitacao) aluno.solicitacao = solicitacao;
  localStorage.setItem(chave, JSON.stringify([...alunos, aluno]));
  return true;
}

export function obterSolicitacao(protocolo) {
  if (!protocolo || typeof protocolo !== 'string') return null;
  const aluno = registros().find((aluno) => aluno?.solicitacao?.protocolo === protocolo);
  return aluno ? { ...aluno.solicitacao, cpf: aluno.cpf } : null;
}
