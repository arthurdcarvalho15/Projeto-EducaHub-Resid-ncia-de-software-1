import { entrar } from '../services/auth.js';
import { alunoCadastrado, normalizarCpf, registrarPreMatricula } from '../services/alunos.js';
import { guardarCpfPreMatricula } from '../services/pre-matricula.js';
import { cpfValidator } from '../utils/cpfValidator.js';
import { definirErro, formatarCpf } from '../formularios.js';

const form = document.querySelector('[data-login-aluno]');
const cpf = form.elements.cpf;
const senha = form.elements.senha;
const status = document.getElementById('aluno-login-status');
const etapaSenha = document.getElementById('aluno-etapa-senha');
const recuperar = document.getElementById('aluno-recuperar');
const continuar = document.getElementById('aluno-continuar');
const novoAluno = document.getElementById('aluno-sem-cadastro');
const outroCpf = document.getElementById('aluno-outro-cpf');
const olho = form.querySelector('[aria-controls="login-senha"]');
let cpfVerificado = '';
let enviando = false;

function ocultarSenha() {
  etapaSenha.hidden = recuperar.hidden = true;
  senha.disabled = true;
  senha.required = false;
  senha.value = '';
  senha.type = 'password';
  definirErro(senha, '');
  olho.setAttribute('aria-pressed', 'false');
  olho.setAttribute('aria-label', 'Mostrar senha');
}

function reiniciar() {
  cpfVerificado = '';
  cpf.readOnly = false;
  ocultarSenha();
  novoAluno.hidden = outroCpf.hidden = true;
  continuar.hidden = false;
  continuar.textContent = 'Verificar CPF';
  status.textContent = '';
}

function identificar() {
  if (!cpfValidator(cpf.value)) {
    reiniciar();
    definirErro(cpf, 'CPF inválido. Digite um CPF válido para continuar.');
    cpf.focus();
    return null;
  }
  definirErro(cpf, '');
  try {
    return alunoCadastrado(cpf.value);
  } catch {
    reiniciar();
    definirErro(cpf, 'Não foi possível consultar os registros locais. Tente novamente.');
    cpf.focus();
    return null;
  }
}

function mostrarSenha() {
  cpfVerificado = normalizarCpf(cpf.value);
  cpf.readOnly = true;
  novoAluno.hidden = true;
  etapaSenha.hidden = recuperar.hidden = false;
  senha.disabled = false;
  senha.required = true;
  outroCpf.hidden = continuar.hidden = false;
  continuar.textContent = 'Entrar';
  status.textContent = 'Identificamos seu cadastro. Informe sua senha para continuar.';
  senha.focus();
}

function oferecerPreMatricula() {
  cpfVerificado = '';
  ocultarSenha();
  cpf.readOnly = true;
  continuar.hidden = true;
  novoAluno.hidden = outroCpf.hidden = false;
  status.textContent = '';
  document.getElementById('aluno-pergunta-matricula').focus();
}

cpf.addEventListener('input', () => {
  if (enviando) return;
  cpf.value = formatarCpf(cpf.value);
  reiniciar();
  definirErro(cpf, '');
});
senha.addEventListener('input', () => definirErro(senha, ''));
outroCpf.addEventListener('click', () => {
  if (enviando) return;
  reiniciar();
  cpf.value = '';
  definirErro(cpf, '');
  cpf.focus();
});
olho.addEventListener('click', () => {
  const mostrar = senha.type === 'password';
  senha.type = mostrar ? 'text' : 'password';
  olho.setAttribute('aria-pressed', String(mostrar));
  olho.setAttribute('aria-label', mostrar ? 'Esconder senha' : 'Mostrar senha');
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (enviando) return;
  const cadastrado = identificar();
  if (cadastrado === null) return;
  if (!cadastrado) return oferecerPreMatricula();
  if (cpfVerificado !== normalizarCpf(cpf.value) || etapaSenha.hidden) return mostrarSenha();
  definirErro(senha, senha.value.length >= 4 ? '' : 'A senha precisa ter pelo menos 4 caracteres.');
  if (senha.getAttribute('aria-invalid') === 'true') return senha.focus();
  enviando = true;
  continuar.disabled = outroCpf.disabled = true;
  continuar.setAttribute('aria-busy', 'true');
  continuar.textContent = 'Entrando…';
  status.textContent = '';
  const cpfAcesso = cpfVerificado;
  try {
    await entrar({ cpf: cpfAcesso, senha: senha.value });
    status.textContent = '✓ Login simulado feito! Entrando…';
    window.location.assign(form.dataset.destino);
  } catch (error) {
    status.textContent = `⚠ ${error.message || 'Não foi possível entrar. Tente novamente.'}`;
    enviando = false;
    continuar.disabled = outroCpf.disabled = false;
    continuar.setAttribute('aria-busy', 'false');
    continuar.textContent = 'Entrar';
  }
});

document.getElementById('aluno-pre-matricula').addEventListener('click', () => {
  const cadastrado = identificar();
  if (cadastrado === null) return;
  if (cadastrado) return mostrarSenha();
  try {
    guardarCpfPreMatricula(cpf.value);
    window.location.assign('/cadastrar/');
  } catch {
    status.textContent =
      '⚠ Não foi possível preservar o CPF. Habilite o armazenamento desta aba e tente novamente.';
  }
});

cpf.disabled = continuar.disabled = false;

if (form.dataset.cpfDemo) {
  try {
    registrarPreMatricula(form.dataset.cpfDemo);
    cpf.value = formatarCpf(form.dataset.cpfDemo);
    mostrarSenha();
    senha.value = form.dataset.senhaDemo;
    status.textContent = 'Demonstração pronta. Clique em Entrar para acessar o sistema simulado.';
  } catch {
    status.textContent =
      '⚠ Não foi possível preparar a demonstração. Verifique o armazenamento deste navegador.';
  }
}
