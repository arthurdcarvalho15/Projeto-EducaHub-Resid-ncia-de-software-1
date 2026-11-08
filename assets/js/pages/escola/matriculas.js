import { mostrarAviso } from '/assets/js/scripts/aviso.js';
import { cpfValidator as cpfValido } from '/assets/js/utils/cpfValidator.js';
const corpo = document.getElementById('corpo-matriculas');
const busca = document.getElementById('busca');
const resultado = document.getElementById('resultado');
const vazio = document.getElementById('vazio');
const filtros = [...document.querySelectorAll('[data-filtro]')];
let filtroAtual = 'todas';
function aplicar() {
  const termo = busca.value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  let visiveis = 0;
  corpo.querySelectorAll('tr').forEach((linha) => {
    const okFiltro = filtroAtual === 'todas' || linha.dataset.status === filtroAtual;
    const okBusca = !termo || (linha.dataset.busca ?? '').includes(termo);
    linha.hidden = !(okFiltro && okBusca);
    if (!linha.hidden) visiveis++;
  });
  resultado.textContent = `Mostrando ${visiveis} matrícula${visiveis === 1 ? '' : 's'}`;
  vazio.hidden = visiveis > 0;
}
filtros.forEach((botao) =>
  botao.addEventListener('click', () => {
    filtroAtual = botao.dataset.filtro ?? 'todas';
    filtros.forEach((b) => b.setAttribute('aria-pressed', String(b === botao)));
    aplicar();
  }),
);
busca.addEventListener('input', aplicar);
// ----- Nova matrícula -----
const dialogo = document.getElementById('dialogo-nova');
const form = document.getElementById('form-nova');
const modelo = document.getElementById('modelo-linha');
const nascimento = document.getElementById('nova-nascimento');
const genero = document.getElementById('nova-genero');
const nacionalidade = document.getElementById('nova-nacionalidade');
const responsavelNome = document.getElementById('nova-resp');
const responsavelNomeCampo = document.getElementById('campo-nome-responsavel');
const dadosResponsavel = document.getElementById('dados-responsavel');
const nomeSocialCampo = document.getElementById('campo-nome-social');
const paineisEtapas = [...document.querySelectorAll('[data-step-panel]')];
const botaoAvancar = document.getElementById('avancar-etapa');
const botaoVoltar = document.getElementById('voltar-etapa');
const botaoConcluir = document.getElementById('concluir-matricula');
let etapaAtual = 0;
function idade(data) {
  const hoje = new Date();
  const nascimentoData = new Date(`${data}T00:00:00`);
  let anos = hoje.getFullYear() - nascimentoData.getFullYear();
  if (
    hoje.getMonth() < nascimentoData.getMonth() ||
    (hoje.getMonth() === nascimentoData.getMonth() && hoje.getDate() < nascimentoData.getDate())
  )
    anos--;
  return anos;
}
function atualizarCondicionais() {
  const menor = Boolean(nascimento.value) && idade(nascimento.value) < 18;
  responsavelNomeCampo.hidden = !menor;
  responsavelNome.required = menor;
  dadosResponsavel.hidden = !menor;
  dadosResponsavel.disabled = !menor;
  const precisaNomeSocial = ['Homem Trans', 'Mulher Trans', 'Não-Binário'].includes(genero.value);
  nomeSocialCampo.hidden = !precisaNomeSocial;
  const nomeSocial = document.getElementById('nova-social');
  nomeSocial.required = false;
  const brasileira = nacionalidade.value === 'Brasil';
  document.querySelectorAll('.nascimento-brasil input').forEach((campo) => {
    campo.required = brasileira;
    campo.parentElement.hidden = !brasileira;
  });
}
nascimento.addEventListener('change', atualizarCondicionais);
genero.addEventListener('change', atualizarCondicionais);
nacionalidade.addEventListener('change', atualizarCondicionais);
atualizarCondicionais();
fetch('/api/listapaises')
  .then((res) => res.json())
  .then((paises) => {
    nacionalidade.replaceChildren(new Option('Selecione a nacionalidade', ''));
    paises.forEach((pais) =>
      nacionalidade.add(new Option(`${pais.icon ? `${pais.icon} ` : ''}${pais.label}`, pais.value)),
    );
    nacionalidade.value = 'Brasil';
    atualizarCondicionais();
  })
  .catch(() => {});
const cpfs = ['nova-cpf', 'nova-cpf-resp'].map((id) => document.getElementById(id));
cpfs.forEach((campo) =>
  campo.addEventListener('input', () => {
    const numeros = campo.value.replace(/\D/g, '').slice(0, 11);
    campo.value = numeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    campo.setCustomValidity('');
  }),
);
function etapasAtivas() {
  return responsavelNome.required ? [0, 1, 2] : [0, 2];
}
function mostrarEtapa() {
  const etapas = etapasAtivas();
  const indice = etapas.indexOf(etapaAtual);
  paineisEtapas.forEach((painel) => {
    painel.hidden = Number(painel.dataset.stepPanel) !== etapaAtual;
  });
  document.querySelectorAll('[data-step-indicator]').forEach((item) => {
    const step = Number(item.dataset.stepIndicator);
    item.hidden = step === 1 && !responsavelNome.required;
    if (step === etapaAtual) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
  botaoVoltar.hidden = indice <= 0;
  botaoAvancar.hidden = indice === etapas.length - 1;
  botaoConcluir.hidden = indice !== etapas.length - 1;
}
function validarEtapaAtual() {
  const painel = paineisEtapas.find((item) => Number(item.dataset.stepPanel) === etapaAtual);
  const cpfsDaEtapa = etapaAtual === 0 ? [cpfs[0]] : etapaAtual === 1 ? [cpfs[1]] : [];
  cpfsDaEtapa.forEach((campo) =>
    campo.setCustomValidity(campo.value && !cpfValido(campo.value) ? 'Informe um CPF válido.' : ''),
  );
  const campos = [...painel.querySelectorAll('input, select, textarea')].filter(
    (campo) => !campo.disabled,
  );
  for (const campo of campos) {
    if (!campo.checkValidity()) {
      campo.reportValidity();
      campo.focus();
      return false;
    }
  }
  return true;
}
botaoAvancar.addEventListener('click', () => {
  atualizarCondicionais();
  if (!validarEtapaAtual()) return;
  const etapas = etapasAtivas();
  etapaAtual = etapas[Math.min(etapas.indexOf(etapaAtual) + 1, etapas.length - 1)];
  mostrarEtapa();
});
botaoVoltar.addEventListener('click', () => {
  const etapas = etapasAtivas();
  etapaAtual = etapas[Math.max(etapas.indexOf(etapaAtual) - 1, 0)];
  mostrarEtapa();
});
mostrarEtapa();
document.getElementById('abrir-nova')?.addEventListener('click', () => {
  etapaAtual = 0;
  mostrarEtapa();
  dialogo.showModal();
});
dialogo
  .querySelectorAll('[data-fechar]')
  .forEach((b) => b.addEventListener('click', () => dialogo.close()));
function validar(id, idErro, msg) {
  const campo = document.getElementById(id);
  const ok = campo.value.trim().length > 0;
  campo.setAttribute('aria-invalid', String(!ok));
  document.getElementById(idErro).textContent = ok ? '' : `⚠ ${msg}`;
  return ok;
}
form.addEventListener('submit', (e) => {
  e.preventDefault();
  atualizarCondicionais();
  cpfs.forEach((campo) => {
    if (!campo.disabled)
      campo.setCustomValidity(
        campo.value && !cpfValido(campo.value) ? 'Informe um CPF válido.' : '',
      );
  });
  if (!form.reportValidity()) return;
  const okAluno = validar('nova-aluno', 'erro-aluno', 'Informe o nome do aluno.');
  const okResp = responsavelNome.required
    ? validar('nova-resp', 'erro-resp', 'Informe o nome do responsável.')
    : true;
  if (!okAluno || !okResp) return;
  const dados = new FormData(form);
  const linha = modelo.content.firstElementChild.cloneNode(true);
  const [aluno, turma, resp, data] = [
    String(dados.get('aluno')).trim(),
    String(dados.get('turma')),
    String(dados.get('responsavel')).trim(),
    new Date().toLocaleDateString('pt-BR'),
  ];
  linha.querySelector('th').textContent = aluno;
  const tds = linha.querySelectorAll('td');
  tds[0].textContent = turma;
  tds[1].textContent = resp;
  tds[2].textContent = data;
  linha.dataset.busca = `${aluno} ${resp}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  linha.classList.add('surgir');
  corpo.prepend(linha);
  form.reset();
  atualizarCondicionais();
  dialogo.close();
  aplicar();
  mostrarAviso(`Matrícula de ${aluno} cadastrada (em análise).`);
});
