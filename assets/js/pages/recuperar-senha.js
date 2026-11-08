'use strict';
const form = document.getElementById('form-recuperar');
const ident = document.getElementById('ident');
const email = document.getElementById('email');
function erro(campo, idErro, mensagem) {
  campo.setAttribute('aria-invalid', String(Boolean(mensagem)));
  document.getElementById(idErro).textContent = mensagem ? `⚠ ${mensagem}` : '';
  return !mensagem;
}
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const ok1 = erro(ident, 'erro-ident', ident.value.trim() ? '' : 'Informe seu CPF ou matrícula.');
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  const ok2 = erro(
    email,
    'erro-email',
    emailValido ? '' : 'Digite um e-mail válido, como nome@email.com.',
  );
  if (!ok1) return ident.focus();
  if (!ok2) return email.focus();
  document.getElementById('etapa-form').hidden = true;
  const ok = document.getElementById('etapa-ok');
  document.getElementById('email-enviado').textContent = email.value.trim();
  ok.hidden = false;
  ok.focus();
});
