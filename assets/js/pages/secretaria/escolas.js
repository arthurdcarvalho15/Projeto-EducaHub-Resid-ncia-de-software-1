'use strict';
import { diretorias } from '/assets/js/services/prototipo.js';
const busca = document.getElementById('busca-escola');
const regiao = document.getElementById('regiao');
const contagem = document.getElementById('contagem');
const linhas = [...document.querySelectorAll('#corpo-escolas tr')];
const diretoriaPorMunicipio = {
  aracaju: 'DEA',
  'nossa senhora do socorro': 'DRE 08',
  lagarto: 'DRE 02',
  laranjeiras: 'DRE 08',
  'nossa senhora da gloria': 'DRE 09',
  propria: 'DRE 06',
  estancia: 'DRE 01',
  itabaiana: 'DRE 03',
};
linhas.forEach((linha) => {
  const municipio = linha.cells[1]?.textContent
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const diretoria = diretoriaPorMunicipio[municipio];
  if (diretoria) {
    linha.dataset.regiao = diretoria;
    linha.cells[2].textContent = diretoria;
  }
});
const form = document.getElementById('formulario-escola');
const abrir = document.getElementById('abrir-cadastro');
const linhasEscolas = document.getElementById('corpo-escolas');
const anexosInfo = document.getElementById('arquivos-selecionados');
const chaveEscolas = 'educahub:secretaria:escolas';
const categoriaInputs = [...form.querySelectorAll('input[type="file"]')];
function lerCadastros() {
  try {
    return JSON.parse(localStorage.getItem(chaveEscolas) ?? '[]');
  } catch {
    return [];
  }
}
function adicionarLinha(escola) {
  if (![...regiao.options].some((option) => option.value === escola.regiao)) {
    const opcao = document.createElement('option');
    opcao.value = escola.regiao;
    opcao.textContent = escola.regiao;
    regiao.add(opcao);
  }
  const tr = document.createElement('tr');
  tr.dataset.regiao = escola.diretoria || escola.regiao;
  tr.dataset.busca = escola.busca;
  const nome = document.createElement('th');
  nome.scope = 'row';
  const nomeSpan = document.createElement('span');
  nomeSpan.className = 'escola-nome';
  nomeSpan.textContent = escola.nome;
  nome.append(nomeSpan);
  const municipio = document.createElement('td');
  municipio.textContent = escola.municipio;
  const regiaoTd = document.createElement('td');
  regiaoTd.textContent = escola.diretoria || escola.regiao;
  const alunosTd = document.createElement('td');
  alunosTd.className = 'centro numero';
  alunosTd.textContent = '0';
  const status = document.createElement('td');
  status.textContent = 'Aguardando análise';
  tr.append(nome, municipio, regiaoTd, alunosTd, status);
  linhasEscolas.prepend(tr);
  linhas.push(tr);
  filtrar();
}
lerCadastros().forEach(adicionarLinha);
abrir.addEventListener('click', () => {
  const expandido = abrir.getAttribute('aria-expanded') === 'true';
  abrir.setAttribute('aria-expanded', String(!expandido));
  form.hidden = expandido;
  if (!expandido) document.getElementById('nome-escola')?.focus();
});
document.getElementById('cancelar-cadastro')?.addEventListener('click', () => {
  form.reset();
  anexosInfo.textContent = 'Nenhum arquivo selecionado.';
  form.hidden = true;
  abrir.setAttribute('aria-expanded', 'false');
});
categoriaInputs.forEach((input) =>
  input.addEventListener('change', () => {
    const n = categoriaInputs.reduce((total, item) => total + (item.files?.length ?? 0), 0);
    anexosInfo.textContent = n
      ? `${n} arquivo${n === 1 ? '' : 's'} selecionado${n === 1 ? '' : 's'}.`
      : 'Nenhum arquivo selecionado.';
  }),
);
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const dados = new FormData(form);
  const nome = String(dados.get('nome') ?? '').trim();
  const municipio = String(dados.get('municipio') ?? '').trim();
  const regiaoNova = String(dados.get('diretoria') ?? '');
  const etapas = dados.getAll('etapas').map(String);
  const turnos = dados.getAll('turnos').map(String);
  if (!etapas.length || !turnos.length) {
    contagem.textContent = 'Selecione ao menos uma etapa/modalidade e uma jornada/turno.';
    return;
  }
  const anexos = categoriaInputs.flatMap((input) =>
    [...(input.files ?? [])].map((file) => ({
      categoria: input.dataset.categoria,
      nome: file.name,
      tipo: file.type,
      bytes: file.size,
    })),
  );
  const termoBusca = `${nome} ${municipio}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const novo = {
    nome,
    municipio,
    regiao: regiaoNova,
    diretoria: regiaoNova,
    uf: String(dados.get('uf') ?? ''),
    alunos: 0,
    ideb: 0,
    busca: termoBusca,
    endereco: String(dados.get('endereco') ?? ''),
    cnpj: String(dados.get('cnpj') ?? ''),
    inep: String(dados.get('inep') ?? ''),
    responsavel: String(dados.get('responsavel') ?? ''),
    email: String(dados.get('email') ?? ''),
    telefone: String(dados.get('telefone') ?? ''),
    etapas,
    turnos,
    dependencia: String(dados.get('dependencia') ?? ''),
    anexos,
    criadoEm: new Date().toISOString(),
  };
  const escolas = lerCadastros();
  escolas.push(novo);
  localStorage.setItem(chaveEscolas, JSON.stringify(escolas));
  try {
    const req = indexedDB.open('educahub-arquivos-escolas', 1);
    await new Promise((resolve, reject) => {
      req.onupgradeneeded = () => req.result.createObjectStore('arquivos', { keyPath: 'id' });
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction('arquivos', 'readwrite');
        categoriaInputs.forEach((input) =>
          [...(input.files ?? [])].forEach((file) =>
            tx.objectStore('arquivos').put({
              id: `${nome}:${file.name}:${file.lastModified}`,
              escola: nome,
              categoria: input.dataset.categoria,
              arquivo: file,
            }),
          ),
        );
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => reject(tx.error);
      };
    });
  } catch {
    /* O cadastro e a lista de nomes continuam disponíveis mesmo se o navegador bloquear o armazenamento de arquivos. */
  }
  adicionarLinha(novo);
  form.reset();
  anexosInfo.textContent = 'Nenhum arquivo selecionado.';
  form.hidden = true;
  abrir.setAttribute('aria-expanded', 'false');
  contagem.textContent = `Escola ${nome} cadastrada para análise.`;
});
function filtrar() {
  const termo = busca.value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  let n = 0;
  linhas.forEach((l) => {
    const ok =
      (!termo || (l.dataset.busca ?? '').includes(termo)) &&
      (!regiao.value || l.dataset.regiao === regiao.value);
    l.hidden = !ok;
    if (ok) n++;
  });
  contagem.textContent = n
    ? `Mostrando ${n} escola${n === 1 ? '' : 's'}`
    : 'Nenhuma escola encontrada.';
}
busca.addEventListener('input', filtrar);
regiao.addEventListener('change', filtrar);
regiao.replaceChildren(
  new Option('Todas as diretorias', ''),
  ...diretorias.map(([sigla, sede]) => new Option(`${sigla} · ${sede}`, sigla)),
);
filtrar();
