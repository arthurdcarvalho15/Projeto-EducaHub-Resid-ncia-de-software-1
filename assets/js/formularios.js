export function formatarCpf(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function definirErro(campo, mensagem) {
  const id = `${campo.id}-validacao`;
  let erro = document.getElementById(id);
  if (!erro) {
    erro = document.createElement('p');
    erro.id = id;
    erro.className = 'erro-campo';
    erro.setAttribute('aria-live', 'polite');
    campo.insertAdjacentElement('afterend', erro);
    campo.setAttribute(
      'aria-describedby',
      [campo.getAttribute('aria-describedby'), id].filter(Boolean).join(' '),
    );
  }
  erro.textContent = mensagem ? `⚠ ${mensagem}` : '';
  campo.setAttribute('aria-invalid', String(Boolean(mensagem)));
  campo.setCustomValidity(mensagem);
}

// Parse dates as local calendar dates to avoid changing birthdays across time zones.
export function idadeNaData(valor, hoje = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return null;
  const [ano, mes, dia] = valor.split('-').map(Number);
  const nascimento = new Date(ano, mes - 1, dia);
  if (
    nascimento.getFullYear() !== ano ||
    nascimento.getMonth() !== mes - 1 ||
    nascimento.getDate() !== dia ||
    nascimento > hoje
  )
    return null;
  let idade = hoje.getFullYear() - ano;
  if (hoje.getMonth() < mes - 1 || (hoje.getMonth() === mes - 1 && hoje.getDate() < dia)) idade--;
  return idade;
}
