import { gravar, ler } from '../scripts/armazenamento.js';
document.querySelectorAll('[data-notificacoes]').forEach((raiz) => {
  const chave = `lidas:${raiz.dataset.perfil}`;
  const botao = raiz.querySelector('[data-notif-botao]');
  const painel = raiz.querySelector('.notif-painel');
  const contador = raiz.querySelector('[data-notif-contador]');
  const rotulo = raiz.querySelector('[data-notif-rotulo]');
  const itens = [...raiz.querySelectorAll('[data-notif-id]')];
  let lidas = new Set(ler(chave, []));
  function atualizar() {
    let naoLidas = 0;
    itens.forEach((item) => {
      const lida = lidas.has(item.dataset.notifId);
      item.classList.toggle('lida', lida);
      if (!lida) naoLidas++;
    });
    contador.textContent = String(naoLidas);
    contador.hidden = naoLidas === 0;
    rotulo.textContent = naoLidas
      ? `Notificações: ${naoLidas} não lidas`
      : 'Notificações: nenhuma nova';
    gravar(chave, [...lidas]);
  }
  function abrirFechar(abrir) {
    painel.hidden = !abrir;
    botao.setAttribute('aria-expanded', String(abrir));
  }
  botao.addEventListener('click', () => abrirFechar(painel.hidden !== false));
  raiz.querySelector('[data-notif-todas]')?.addEventListener('click', () => {
    itens.forEach((i) => lidas.add(i.dataset.notifId));
    atualizar();
  });
  itens.forEach((item) => {
    item.querySelector('.notif-ler')?.addEventListener('click', () => {
      lidas.add(item.dataset.notifId);
      atualizar();
      botao.focus();
    });
  });
  // Fecha ao clicar fora ou apertar Esc
  document.addEventListener('click', (e) => {
    if (!raiz.contains(e.target)) abrirFechar(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !painel.hidden) {
      abrirFechar(false);
      botao.focus();
    }
  });
  lidas = new Set([...lidas].filter((id) => itens.some((i) => i.dataset.notifId === id)));
  atualizar();
});
