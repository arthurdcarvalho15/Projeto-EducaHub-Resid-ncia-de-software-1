import { cpfValidator } from './utils/cpfValidator.js';
import { formatarCpf, definirErro, idadeNaData } from './formularios.js';

const form = document.getElementById('form-matricula');
const campos = form.elements;
const status = document.getElementById('cadastro-status');
let atual = 'aluno';
let enviando = false;
let buscaCep = 0;
let buscaCidade = 0;
const menor = () => {
  const idade = idadeNaData(campos.dataNascimento.value);
  return idade !== null && idade < 18;
};
const sequencia = () => (menor() ? ['aluno', 'responsavel', 'endereco'] : ['aluno', 'endereco']);
const informar = (mensagem) => {
  status.textContent = mensagem;
};

function mostrarEtapa(nome) {
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
    buscaCep++;
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
  if (atual !== 'endereco') {
    if (validarEtapa(atual)) mostrarEtapa(sequencia()[sequencia().indexOf(atual) + 1]);
    return;
  }
  for (const etapa of sequencia()) {
    if (!validarEtapa(etapa)) {
      mostrarEtapa(etapa);
      validarEtapa(etapa);
      return;
    }
  }
  enviando = true;
  form.querySelectorAll('[data-etapa], .etapas').forEach((el) => {
    el.hidden = true;
  });
  informar('');
  document.getElementById('protocolo').textContent =
    `${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const concluido = document.getElementById('cadastro-concluido');
  concluido.hidden = false;
  concluido.focus();
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
async function consultar(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('Serviço indisponível');
  return response.json();
}
campos.estadoNatal.addEventListener('change', async () => {
  const uf = campos.estadoNatal.value.toUpperCase();
  const pedido = ++buscaCidade;
  campos.naturalidade.value = '';
  lista('lista-cidades', []);
  if (!ufs.includes(uf)) return;
  try {
    const cidades = await consultar(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
    );
    if (pedido === buscaCidade)
      lista(
        'lista-cidades',
        cidades.map((c) => c.nome),
      );
  } catch {
    if (pedido === buscaCidade)
      informar('⚠ Não foi possível consultar as cidades. Digite a cidade natal manualmente.');
  }
});
campos.cep.addEventListener('blur', async () => {
  const cep = campos.cep.value.replace(/\D/g, '');
  if (cep.length !== 8) return;
  const pedido = ++buscaCep;
  informar('Consultando CEP…');
  try {
    const endereco = await consultar(`https://brasilapi.com.br/api/cep/v2/${cep}`);
    if (pedido !== buscaCep) return;
    for (const [campo, valor] of Object.entries({
      estadoResidencial: endereco.state,
      municipioResidencial: endereco.city,
      bairroResidencial: endereco.neighborhood,
      logradouro: endereco.street,
    })) {
      campos[campo].value = valor || '';
      definirErro(campos[campo], '');
    }
    informar('✓ Endereço consultado. Confira os dados e complete os campos restantes.');
  } catch {
    if (pedido === buscaCep)
      informar(
        '⚠ Não foi possível consultar o CEP. Confira o número ou preencha o endereço manualmente.',
      );
  }
});
atualizarCondicionais();
