import { cpfValidator } from './utils/cpfValidator.js';
import { formatarCpf, definirErro, idadeNaData } from './formularios.js';
import { alunoCadastrado, normalizarCpf } from './services/alunos.js';
import { consumirCpfPreMatricula } from './services/pre-matricula.js';
import { concluirSolicitacao, anonimizarNome, mascararCpf } from './services/solicitacoes.js';
import { configurarOferta } from './pages/aluno/oferta-matricula.js';
import { prepararComprovante } from './components/ComprovanteAluno.js';
import { carregarOfertas } from './services/ofertas-escolares.js';

const form = document.getElementById('form-matricula');
const campos = form.elements;
const status = document.getElementById('cadastro-status');
let atual = 'escolar';
let enviando = false;
let cpfVerificado = '';
const identificacao = document.getElementById('identificacao-aluno');
const verificar = document.getElementById('form-verificar-cpf');
const cpfIdentificacao = verificar.elements.cpf;
const resultadoCpf = document.getElementById('resultado-cpf');
const mensagemCpf = document.getElementById('mensagem-cpf');
const iniciar = document.getElementById('iniciar-pre-matricula');
const erroCpf = 'CPF inválido. Verifique os números informados e tente novamente.';
const oferta = configurarOferta(form);
const comprovante = prepararComprovante(() => {
  informarOutroCpf();
  definirErro(
    cpfIdentificacao,
    'Não foi possível localizar uma solicitação válida para este comprovante.',
  );
});

function exibirResultado(cadastrado) {
  verificar.hidden = true;
  resultadoCpf.hidden = false;
  mensagemCpf.textContent = cadastrado
    ? 'Identificamos que já existe um cadastro associado ao CPF informado.'
    : 'Não encontramos um cadastro associado ao CPF informado. Você poderá iniciar sua pré-matrícula.';
  document.getElementById('acessar-conta').hidden = !cadastrado;
  document.getElementById('recuperar-acesso').hidden = !cadastrado;
  iniciar.hidden = cadastrado;
  mensagemCpf.focus();
}

function informarOutroCpf() {
  cpfVerificado = '';
  enviando = false;
  comprovante.limpar();
  window.history.replaceState(null, '', window.location.pathname);
  form.reset();
  oferta.reiniciar();
  form.querySelector('.etapas').hidden = false;
  form.hidden = true;
  form.querySelectorAll('[data-etapa]').forEach((etapa) => {
    etapa.disabled = true;
  });
  form.querySelectorAll('[aria-invalid]').forEach((campo) => definirErro(campo, ''));
  atualizarCondicionais();
  identificacao.hidden = false;
  verificar.hidden = false;
  resultadoCpf.hidden = true;
  cpfIdentificacao.value = '';
  definirErro(cpfIdentificacao, '');
  cpfIdentificacao.focus();
}
document.getElementById('nova-solicitacao').addEventListener('click', informarOutroCpf);

cpfIdentificacao.addEventListener('input', () => {
  cpfIdentificacao.value = formatarCpf(cpfIdentificacao.value);
  definirErro(cpfIdentificacao, '');
});
function identificarCpf() {
  if (!cpfValidator(cpfIdentificacao.value)) {
    definirErro(cpfIdentificacao, erroCpf);
    cpfIdentificacao.focus();
    return;
  }
  try {
    const cadastrado = alunoCadastrado(cpfIdentificacao.value);
    cpfVerificado = cadastrado ? '' : normalizarCpf(cpfIdentificacao.value);
    exibirResultado(cadastrado);
  } catch {
    definirErro(
      cpfIdentificacao,
      'Não foi possível consultar os registros locais. Tente novamente.',
    );
    cpfIdentificacao.focus();
  }
}
verificar.addEventListener('submit', (event) => {
  event.preventDefault();
  identificarCpf();
});
document.getElementById('outro-cpf').addEventListener('click', informarOutroCpf);
document.getElementById('alterar-cpf').addEventListener('click', informarOutroCpf);

function conferirCpf() {
  if (!cpfValidator(cpfVerificado) || normalizarCpf(campos.cpf.value) !== cpfVerificado) {
    informarOutroCpf();
    definirErro(
      cpfIdentificacao,
      'Não foi possível identificar o aluno. Retorne à etapa de verificação do CPF.',
    );
    return false;
  }
  try {
    if (!alunoCadastrado(cpfVerificado)) return true;
    form.hidden = true;
    identificacao.hidden = false;
    cpfVerificado = '';
    exibirResultado(true);
  } catch {
    if (form.hidden) {
      iniciar.hidden = true;
      mensagemCpf.textContent =
        'Não foi possível consultar os registros locais. Informe o CPF novamente.';
      mensagemCpf.focus();
    } else informar('⚠ Não foi possível consultar os registros locais. Tente novamente.');
  }
  return false;
}

function iniciarPreMatricula() {
  campos.cpf.value = formatarCpf(cpfVerificado);
  if (!conferirCpf()) return;
  identificacao.hidden = true;
  form.hidden = false;
  document.getElementById('cpf-escolar').textContent = mascararCpf(cpfVerificado);
  mostrarEtapa('escolar');
}
iniciar.addEventListener('click', iniciarPreMatricula);
const menor = () => {
  const idade = idadeNaData(campos.dataNascimento.value);
  return idade !== null && idade < 18;
};
const sequencia = () =>
  menor()
    ? ['escolar', 'aluno', 'responsavel', 'endereco', 'revisao']
    : ['escolar', 'aluno', 'endereco', 'revisao'];
const informar = (mensagem) => {
  status.textContent = mensagem;
};

function mostrarEtapa(nome) {
  if (nome === 'revisao') {
    let escolar;
    try {
      escolar = oferta.descricao();
    } catch {
      mostrarEtapa('escolar');
      oferta.validar();
      informar('⚠ Confira as ofertas escolares antes de revisar a solicitação.');
      return;
    }
    const resumo = document.getElementById('resumo-solicitacao');
    resumo.replaceChildren();
    for (const [rotulo, valor] of Object.entries({
      Aluno: anonimizarNome(campos.nomeCompleto.value),
      CPF: mascararCpf(cpfVerificado),
      'Ano letivo': escolar.anoLetivo,
      Série: escolar.serie,
      Município: escolar.municipio,
      Escola: escolar.escola,
      Turno: escolar.turno,
    })) {
      const grupo = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = rotulo;
      dd.textContent = String(valor);
      grupo.append(dt, dd);
      resumo.append(grupo);
    }
  }
  atual = nome;
  form.querySelectorAll('[data-etapa]').forEach((etapa) => {
    etapa.hidden = etapa.dataset.etapa !== nome;
    etapa.disabled = etapa.hidden;
  });
  form.querySelectorAll('[data-indicador]').forEach((item) => {
    item.hidden = item.dataset.indicador === 'responsavel' && !menor();
    if (item.dataset.indicador === nome) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
  informar('');
  form.querySelector(`[data-etapa="${nome}"] legend`).focus();
}

function validarEtapa(nome) {
  if (!conferirCpf()) return false;
  if (nome === 'escolar') {
    const ok = oferta.validar();
    if (!ok)
      informar(
        '⚠ Preencha todos os campos obrigatórios para continuar. Confira a compatibilidade da escola e do turno.',
      );
    return ok;
  }
  let primeiro;
  for (const campo of form.querySelectorAll(
    `[data-etapa="${nome}"] input, [data-etapa="${nome}"] select`,
  )) {
    if (campo.closest('.campo').hidden) continue;
    campo.setCustomValidity('');
    let mensagem = '';
    if (campo.required && !campo.value.trim()) mensagem = 'Preencha este campo.';
    else if (campo.value && /cpf$/i.test(campo.name) && !cpfValidator(campo.value))
      mensagem = 'Digite um CPF válido.';
    else if (campo.type === 'date' && idadeNaData(campo.value) === null)
      mensagem = 'Informe uma data válida que não esteja no futuro.';
    else if (campo.value && campo.type === 'email' && campo.validity.typeMismatch)
      mensagem = 'Digite um e-mail válido.';
    else if (
      campo.name === 'responsavelTelefone' &&
      !/^\d{10,11}$/.test(campo.value.replace(/\D/g, ''))
    )
      mensagem = 'Informe o DDD e o telefone com 10 ou 11 números.';
    else if (campo.name === 'cep' && campo.value.replace(/\D/g, '').length !== 8)
      mensagem = 'O CEP precisa ter 8 números.';
    else if (
      ['estadoResidencial', 'estadoNatal'].includes(campo.name) &&
      campo.value &&
      !ufs.includes(campo.value.toUpperCase())
    )
      mensagem = 'Informe uma UF válida, como SE.';
    else if (campo.minLength > 0 && campo.value.trim().length < campo.minLength)
      mensagem = `Digite pelo menos ${campo.minLength} caracteres.`;
    definirErro(campo, mensagem);
    if (mensagem && !primeiro) primeiro = campo;
  }
  if (primeiro) {
    primeiro.focus();
    informar('⚠ Confira os campos indicados antes de continuar.');
  }
  return !primeiro;
}

function atualizarCondicionais() {
  for (const prefixo of ['', 'responsavel']) {
    const genero = campos[prefixo ? 'responsavelGenero' : 'genero'];
    const nome = campos[prefixo ? 'responsavelNomeSocial' : 'nomeSocial'];
    nome.closest('.campo').hidden = !['Homem Trans', 'Mulher Trans', 'Não-Binário'].includes(
      genero.value,
    );
  }
  const brasileiro = campos.nacionalidade.value.trim().toLocaleLowerCase('pt-BR') === 'brasil';
  for (const campo of [campos.estadoNatal, campos.naturalidade]) {
    campo.required = brasileiro;
    campo.closest('.campo').hidden = !brasileiro;
    if (!brasileiro) {
      campo.value = '';
      definirErro(campo, '');
    }
  }
  form.querySelector('[data-indicador="responsavel"]').hidden = !menor();
}

form.addEventListener('input', (event) => {
  const campo = event.target;
  if (!campo.name) return;
  definirErro(campo, '');
  if (/cpf$/i.test(campo.name)) campo.value = formatarCpf(campo.value);
  if (campo.name === 'cep') {
    campo.value = campo.value
      .replace(/\D/g, '')
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
  if (['estadoNatal', 'estadoResidencial'].includes(campo.name))
    campo.value = campo.value.toUpperCase();
  if (campo.name === 'responsavelTelefone')
    campo.value = campo.value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
});
form.addEventListener('change', atualizarCondicionais);
form.querySelectorAll('[data-continuar]').forEach((botao) =>
  botao.addEventListener('click', () => {
    if (validarEtapa(atual)) mostrarEtapa(sequencia()[sequencia().indexOf(atual) + 1]);
  }),
);
form
  .querySelectorAll('[data-voltar]')
  .forEach((botao) =>
    botao.addEventListener('click', () =>
      mostrarEtapa(sequencia()[sequencia().indexOf(atual) - 1]),
    ),
  );
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (enviando) return;
  // Enter inside an earlier step advances instead of submitting incomplete data.
  if (atual !== 'revisao') {
    if (validarEtapa(atual)) mostrarEtapa(sequencia()[sequencia().indexOf(atual) + 1]);
    return;
  }
  for (const etapa of sequencia()) {
    if (!validarEtapa(etapa)) {
      if (form.hidden) return;
      mostrarEtapa(etapa);
      validarEtapa(etapa);
      return;
    }
  }
  enviando = true;
  const confirmar = document.getElementById('confirmar-solicitacao');
  confirmar.disabled = true;
  confirmar.setAttribute('aria-busy', 'true');
  try {
    const solicitacao = concluirSolicitacao({
      cpf: cpfVerificado,
      nome: campos.nomeCompleto.value,
      selecao: oferta.selecao(),
    });
    window.history.replaceState(
      null,
      '',
      `#comprovante=${encodeURIComponent(solicitacao.protocolo)}`,
    );
    if (!comprovante.mostrar(solicitacao.protocolo))
      throw new Error('Não foi possível exibir o comprovante da solicitação.');
  } catch (error) {
    enviando = false;
    informar(
      `⚠ ${error.message || 'Não foi possível salvar a pré-matrícula neste navegador. Tente novamente.'}`,
    );
  } finally {
    confirmar.disabled = false;
    confirmar.setAttribute('aria-busy', 'false');
  }
});

const ufs = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];
function lista(id, valores) {
  document.getElementById(id).replaceChildren(
    ...valores.map((valor) => {
      const option = document.createElement('option');
      option.value = valor;
      return option;
    }),
  );
}
lista('lista-estados', ufs);
// Country names are provided locally by the browser's internationalization API.
const regioes = new Intl.DisplayNames(['pt-BR'], { type: 'region' });
const paises = [];
for (let a = 65; a <= 90; a++)
  for (let b = 65; b <= 90; b++) {
    const codigo = String.fromCharCode(a, b);
    const nome = regioes.of(codigo);
    if (nome && nome !== codigo) paises.push(nome);
  }
lista(
  'lista-paises',
  [...new Set(paises)].sort((a, b) => a.localeCompare(b, 'pt-BR')),
);
campos.estadoNatal.addEventListener('change', () => {
  const uf = campos.estadoNatal.value.toUpperCase();
  campos.naturalidade.value = '';
  const municipios =
    uf === 'SE' ? [...new Set(carregarOfertas().escolas.map((escola) => escola.municipio))] : [];
  lista('lista-cidades', municipios);
});
atualizarCondicionais();
const cpfRecebido = consumirCpfPreMatricula();
if (cpfRecebido) {
  window.history.replaceState(null, '', window.location.pathname);
  cpfIdentificacao.value = formatarCpf(cpfRecebido);
  identificarCpf();
  if (cpfVerificado) iniciarPreMatricula();
} else {
  const protocolo = new URLSearchParams(window.location.hash.slice(1)).get('comprovante');
  if (protocolo && !comprovante.mostrar(protocolo)) {
    definirErro(
      cpfIdentificacao,
      'Não foi possível localizar uma solicitação válida para este comprovante.',
    );
  }
}
