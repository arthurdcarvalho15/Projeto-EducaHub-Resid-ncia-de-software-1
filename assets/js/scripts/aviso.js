export function mostrarAviso(mensagem, tipo = 'sucesso') {
  const regiao = document.getElementById('avisos');
  if (!regiao) return;
  const item = document.createElement('div');
  item.className = `aviso aviso-${tipo}`;
  item.setAttribute('role', 'status');
  const simbolo = tipo === 'sucesso' ? '✓' : tipo === 'alerta' ? '!' : 'i';
  item.innerHTML = `<span class="aviso-simbolo" aria-hidden="true">${simbolo}</span><span></span>`;
  item.lastElementChild.textContent = mensagem;
  regiao.appendChild(item);
  window.setTimeout(() => {
    item.classList.add('saindo');
    window.setTimeout(() => item.remove(), 300);
  }, 4000);
}
