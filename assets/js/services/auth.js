/**
 * Serviço de autenticação — SIMULADO.
 * Ainda não existe back-end: qualquer CPF válido entra, desde que a senha tenha
 * pelo menos 4 caracteres. Quando a API existir, troque o corpo de `entrar`
 * por um `fetch` para o endpoint de login (o resto do formulário continua igual).
 */
export async function entrar({ cpf, senha }) {
  // Simula a latência da rede (permite ver o estado "Entrando...")
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (!cpf || cpf.length !== 11) {
    throw new Error('CPF inválido.');
  }
  if (!senha || senha.length < 4) {
    throw new Error('CPF ou senha incorretos. Tente novamente.');
  }

  try {
    sessionStorage.setItem('educahub:sessao', JSON.stringify({ cpf, entrouEm: Date.now() }));
  } catch {
    /* sem armazenamento: segue sem salvar a sessão */
  }
  return { ok: true };
}
