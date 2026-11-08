import { gravar, ler } from '/assets/js/scripts/armazenamento.js';
import { mostrarAviso } from '/assets/js/scripts/aviso.js';
const form = document.getElementById('form-pedido');
const lista = document.getElementById('lista-pedidos');
const modelo = document.getElementById('modelo-pedido');
function adicionarNaLista(p) {
  const item = modelo.content.firstElementChild.cloneNode(true);
  item.querySelector("[data-campo='tipo']").textContent = p.tipo;
  item.querySelector("[data-campo='info']").textContent = `Protocolo ${p.protocolo} · ${p.data}`;
  lista.prepend(item);
}
// Pedidos feitos em visitas anteriores (salvos no navegador)
const salvos = ler('pedidos', []);
salvos.forEach(adicionarNaLista);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const dados = new FormData(form);
  const pedido = {
    protocolo: `2026-${String(1200 + salvos.length + 1).padStart(5, '0')}`,
    tipo: String(dados.get('tipo')),
    data: new Date().toLocaleDateString('pt-BR'),
  };
  salvos.unshift(pedido);
  gravar('pedidos', salvos);
  adicionarNaLista(pedido);
  form.reset();
  mostrarAviso(`Pedido enviado! Protocolo ${pedido.protocolo}.`);
});
