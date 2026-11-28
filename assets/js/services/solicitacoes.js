import { cpfValidator } from '../utils/cpfValidator.js';
import { alunoCadastrado, obterSolicitacao, registrarPreMatricula } from './alunos.js';
import { carregarOfertas, descreverOferta } from './ofertas-escolares.js';

export function concluirSolicitacao({ cpf, nome, selecao }, agora = new Date()) {
  if (!cpfValidator(String(cpf ?? '')))
    throw new Error('Não foi possível identificar o aluno. Retorne à etapa de verificação do CPF.');
  if (typeof nome !== 'string' || nome.trim().length < 3)
    throw new Error('Informe o nome do aluno.');
  if (alunoCadastrado(cpf)) throw new Error('Já existe um cadastro associado ao CPF informado.');
  const escolar = descreverOferta(carregarOfertas(agora), selecao);
  let protocolo;
  for (let tentativa = 0; tentativa < 10; tentativa++) {
    protocolo = `${agora.getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    if (!obterSolicitacao(protocolo)) break;
    protocolo = '';
  }
  if (!protocolo) throw new Error('Não foi possível gerar o protocolo. Tente novamente.');
  const solicitacao = {
    protocolo,
    criadoEm: agora.toISOString(),
    status: 'analise',
    nome: nome.trim(),
    escolar,
  };
  if (!registrarPreMatricula(cpf, solicitacao))
    throw new Error('Já existe um cadastro associado ao CPF informado.');
  return obterSolicitacao(protocolo);
}

export function anonimizarNome(nome) {
  const partes = String(nome ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return partes
    .map((parte, indice) =>
      indice === 0 || ['da', 'de', 'do', 'das', 'dos', 'e'].includes(parte.toLowerCase())
        ? parte
        : `${[...parte][0]}.`,
    )
    .join(' ');
}

export function mascararCpf(cpf) {
  const numeros = String(cpf ?? '').replace(/\D/g, '');
  return cpfValidator(numeros)
    ? `***.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-**`
    : 'CPF indisponível';
}

export function dadosComprovante(solicitacao) {
  const s = solicitacao;
  if (
    !s ||
    !/^\d{4}-[A-F0-9]{8}$/.test(s.protocolo) ||
    !cpfValidator(String(s.cpf ?? '')) ||
    typeof s.nome !== 'string' ||
    s.nome.trim().length < 3 ||
    !Number.isFinite(new Date(s.criadoEm).getTime()) ||
    !['analise', 'pendente', 'confirmada'].includes(s.status) ||
    !s.escolar ||
    !Number.isInteger(s.escolar.anoLetivo) ||
    ['serie', 'municipio', 'escola', 'turno'].some(
      (chave) => typeof s.escolar[chave] !== 'string' || !s.escolar[chave].trim(),
    )
  )
    return null;
  const confirmada = s.status === 'confirmada';
  return {
    protocolo: s.protocolo,
    data: new Date(s.criadoEm).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    horario: new Date(s.criadoEm).toLocaleTimeString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
    }),
    titulo: confirmada ? 'Comprovante de Matrícula' : 'Comprovante de Pré-Matrícula',
    situacao: confirmada ? 'Matrícula confirmada' : 'Aguardando confirmação',
    orientacao: confirmada
      ? 'Matrícula confirmada no registro simulado. Procure a unidade escolar para conferir os próximos passos.'
      : 'Este comprovante confirma o registro da solicitação de pré-matrícula e não garante a efetivação da matrícula ou a disponibilidade de vaga na unidade escolar selecionada.',
    nome: anonimizarNome(s.nome),
    cpf: mascararCpf(s.cpf),
    anoLetivo: s.escolar.anoLetivo,
    serie: s.escolar.serie,
    municipio: s.escolar.municipio,
    escola: s.escolar.escola,
    turno: s.escolar.turno,
  };
}
