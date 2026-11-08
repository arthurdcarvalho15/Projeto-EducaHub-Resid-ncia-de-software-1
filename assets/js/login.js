import { entrar } from './services/auth.js';
import { cpfValidator } from './utils/cpfValidator.js';
import { formatarCpf, definirErro } from './formularios.js';

const form = document.querySelector('[data-login]');
if (form) {
  const cpf = form.elements.cpf;
  const senha = form.elements.senha;
  const botao = form.querySelector('button:not([type="button"])');
  const status = form.querySelector('[aria-live]');
  cpf.required = senha.required = true;
  senha.minLength = 4;
  cpf.addEventListener('input', () => {
    cpf.value = formatarCpf(cpf.value);
    definirErro(cpf, '');
  });
  senha.addEventListener('input', () => definirErro(senha, ''));
  const olho = form.querySelector('[aria-controls]');
  olho.addEventListener('click', () => {
    const mostrar = senha.type === 'password';
    senha.type = mostrar ? 'text' : 'password';
    olho.setAttribute('aria-pressed', String(mostrar));
    olho.setAttribute('aria-label', mostrar ? 'Esconder senha' : 'Mostrar senha');
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (botao.disabled) return;
    status.textContent = '';
    definirErro(cpf, cpfValidator(cpf.value) ? '' : 'Digite um CPF válido com 11 números.');
    definirErro(
      senha,
      senha.value.length >= 4 ? '' : 'A senha precisa ter pelo menos 4 caracteres.',
    );
    const invalido = [cpf, senha].find((el) => el.getAttribute('aria-invalid') === 'true');
    if (invalido) return invalido.focus();
    botao.disabled = true;
    botao.setAttribute('aria-busy', 'true');
    botao.textContent = 'Entrando…';
    try {
      await entrar({ cpf: cpf.value.replace(/\D/g, ''), senha: senha.value });
      status.textContent = '✓ Login feito! Entrando…';
      window.location.assign(form.dataset.destino);
    } catch (error) {
      status.textContent = `⚠ ${error.message || 'Não foi possível entrar. Tente novamente.'}`;
      botao.disabled = false;
      botao.setAttribute('aria-busy', 'false');
      botao.textContent = 'Entrar';
    }
  });
}
