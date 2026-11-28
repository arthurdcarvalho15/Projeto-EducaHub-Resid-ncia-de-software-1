import { obterSolicitacao } from '../services/alunos.js';
import { dadosComprovante } from '../services/solicitacoes.js';

export function prepararComprovante(aoAusente) {
  const artigo = document.getElementById('cadastro-concluido');
  let protocoloAtual = '';
  function mostrar(protocolo, focar = true) {
    let dados;
    try {
      dados = dadosComprovante(obterSolicitacao(protocolo));
    } catch {
      dados = null;
    }
    if (!dados) return false;
    protocoloAtual = protocolo;
    document.getElementById('titulo-concluido').textContent = dados.titulo;
    artigo.querySelectorAll('[data-comprovante]').forEach((campo) => {
      campo.textContent = String(dados[campo.dataset.comprovante]);
    });
    document.getElementById('form-matricula').hidden = true;
    document.getElementById('identificacao-aluno').hidden = true;
    artigo.hidden = false;
    document.body.classList.add('comprovante-aberto');
    if (focar) artigo.focus();
    return true;
  }
  function imprimir() {
    if (!mostrar(protocoloAtual, false)) {
      limpar();
      aoAusente();
      return;
    }
    window.print();
  }
  function limpar() {
    protocoloAtual = '';
    artigo.hidden = true;
    artigo.querySelectorAll('[data-comprovante]').forEach((campo) => {
      campo.textContent = '';
    });
    document.body.classList.remove('comprovante-aberto');
  }
  document.getElementById('imprimir-comprovante').addEventListener('click', imprimir);
  document.getElementById('pdf-comprovante').addEventListener('click', imprimir);
  return { mostrar, limpar };
}
