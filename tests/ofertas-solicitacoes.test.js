import test from 'node:test';
import assert from 'node:assert/strict';
import {
  carregarOfertas,
  escolasCompativeis,
  turnosDisponiveis,
  validarOferta,
} from '../assets/js/services/ofertas-escolares.js';
import {
  concluirSolicitacao,
  anonimizarNome,
  mascararCpf,
  dadosComprovante,
} from '../assets/js/services/solicitacoes.js';
import { obterSolicitacao, alunoCadastrado } from '../assets/js/services/alunos.js';

test('Ofertas escolares e comprovantes preservam a solicitação e os dados existentes', async (t) => {
  const dados = new Map();
  const anterior = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (chave) => dados.get(chave) ?? null,
      setItem: (chave, valor) => dados.set(chave, valor),
    },
  });
  t.after(() => {
    if (anterior) Object.defineProperty(globalThis, 'localStorage', anterior);
    else delete globalThis.localStorage;
  });
  const agora = new Date('2026-11-27T13:30:00Z');
  const selecao = {
    anoLetivo: '2026',
    serie: 'fundamental-6',
    municipioEscola: 'Aracaju',
    escola: 'jardim-mangabeiras',
    turno: 'Matutino',
  };

  await t.test('filtra ano, série, município, escola e turno sem gravar', () => {
    const catalogo = carregarOfertas(agora);
    assert.deepEqual(catalogo.anos, [2026, 2027]);
    assert.equal(escolasCompativeis(catalogo, selecao).length, 1);
    assert.deepEqual(turnosDisponiveis(catalogo, selecao), ['Matutino', 'Vespertino']);
    assert.equal(validarOferta(catalogo, selecao), true);
    for (const alteracao of [
      { anoLetivo: '' },
      { anoLetivo: '2035' },
      { serie: '' },
      { serie: 'medio-1' },
      { municipioEscola: 'Lagarto' },
      { escola: 'rio-sergipe' },
      { turno: 'Noturno' },
      { turno: '' },
    ]) {
      assert.equal(validarOferta(catalogo, { ...selecao, ...alteracao }), false);
    }
    assert.deepEqual(escolasCompativeis(catalogo, { ...selecao, serie: 'medio-1' }), []);
    assert.equal(dados.size, 0);
  });

  await t.test('reutiliza anos e escolas locais sem modificar as chaves de outros perfis', () => {
    dados.set('educahub:ano-letivo:v1', JSON.stringify({ anos: [2028], ativo: 2028 }));
    dados.set(
      'educahub:secretaria:escolas',
      JSON.stringify([
        {
          nome: 'Unidade Fictícia',
          municipio: 'Aracaju',
          etapas: ['Ensino Médio'],
          turnos: ['Integral'],
        },
        { nome: 'Unidade Sem Turno', municipio: 'Aracaju', etapas: ['Ensino Médio'], turnos: [] },
        { nome: 12 },
        null,
      ]),
    );
    const antes = new Map(dados);
    const catalogo = carregarOfertas(agora);
    assert.deepEqual(catalogo.anos, [2028]);
    const consulta = { anoLetivo: '2028', serie: 'medio-1', municipioEscola: 'Aracaju' };
    assert.equal(escolasCompativeis(catalogo, consulta).length, 2);
    const escola = catalogo.escolas.find((escola) => escola.nome === 'Unidade Sem Turno');
    assert.deepEqual(turnosDisponiveis(catalogo, { ...consulta, escola: escola.id }), []);
    assert.deepEqual(dados, antes);
    dados.delete('educahub:ano-letivo:v1');
    dados.delete('educahub:secretaria:escolas');
  });

  await t.test('oferta cadastrada da mesma unidade prevalece sobre o complemento simulado', () => {
    dados.set(
      'educahub:secretaria:escolas',
      JSON.stringify([
        {
          nome: 'E. E. Jardim das Mangabeiras',
          municipio: 'Aracaju',
          etapas: ['Ensino Fundamental'],
          turnos: ['Noturno'],
        },
      ]),
    );
    const antes = dados.get('educahub:secretaria:escolas');
    const catalogo = carregarOfertas(agora);
    assert.deepEqual(turnosDisponiveis(catalogo, selecao), ['Noturno']);
    assert.equal(validarOferta(catalogo, selecao), false);
    assert.equal(escolasCompativeis(catalogo, selecao).length, 1);
    assert.equal(dados.get('educahub:secretaria:escolas'), antes);
    dados.delete('educahub:secretaria:escolas');
  });

  let solicitacao;
  await t.test(
    'conclui uma única solicitação com dados efetivos, data e protocolo persistentes',
    () => {
      dados.set('educahub:alunos:v1', JSON.stringify([{ cpf: '12345678909' }]));
      dados.set('educahub:professores-escola:v1', '[{"nome":"Docente fictício"}]');
      const professores = dados.get('educahub:professores-escola:v1');
      solicitacao = concluirSolicitacao(
        { cpf: '529.982.247-25', nome: 'João da Silva Santos', selecao },
        agora,
      );
      assert.match(solicitacao.protocolo, /^2026-[A-F0-9]{8}$/);
      assert.equal(solicitacao.criadoEm, '2026-11-27T13:30:00.000Z');
      assert.equal(solicitacao.status, 'analise');
      assert.equal(solicitacao.escolar.escola, 'E. E. Jardim das Mangabeiras');
      assert.equal(alunoCadastrado('52998224725'), true);
      assert.deepEqual(obterSolicitacao(solicitacao.protocolo), solicitacao);
      assert.equal(dados.get('educahub:professores-escola:v1'), professores);
      const antes = dados.get('educahub:alunos:v1');
      assert.throws(() =>
        concluirSolicitacao({ cpf: '52998224725', nome: 'João da Silva Santos', selecao }, agora),
      );
      assert.equal(dados.get('educahub:alunos:v1'), antes);
    },
  );

  await t.test('dados incompletos, CPF ausente e oferta incompatível não geram registro', () => {
    const antes = new Map(dados);
    for (const entrada of [
      { cpf: '', nome: 'Aluno Fictício', selecao },
      { cpf: '11144477735', nome: '', selecao },
      { cpf: '11144477735', nome: 'Aluno Fictício', selecao: { ...selecao, turno: 'Noturno' } },
    ])
      assert.throws(() => concluirSolicitacao(entrada, agora));
    assert.deepEqual(dados, antes);
  });

  await t.test(
    'comprovante mascara os dados sem alterar o registro e não promove pré-matrícula',
    () => {
      const antes = structuredClone(solicitacao);
      const comprovante = dadosComprovante(solicitacao);
      assert.equal(anonimizarNome('João da Silva Santos'), 'João da S. S.');
      assert.equal(mascararCpf('52998224725'), '***.982.247-**');
      assert.equal(comprovante.nome, 'João da S. S.');
      assert.equal(comprovante.cpf, '***.982.247-**');
      assert.equal(comprovante.data, '27/11/2026');
      assert.equal(comprovante.horario, '10:30');
      assert.equal(comprovante.titulo, 'Comprovante de Pré-Matrícula');
      assert.equal(comprovante.situacao, 'Aguardando confirmação');
      assert.match(comprovante.orientacao, /não garante/);
      assert.deepEqual(solicitacao, antes);
      assert.equal(
        dadosComprovante({ ...solicitacao, status: 'confirmada' }).titulo,
        'Comprovante de Matrícula',
      );
      assert.equal(
        dadosComprovante({ ...solicitacao, status: 'pendente' }).situacao,
        'Aguardando confirmação',
      );
      const malformado = {
        ...solicitacao,
        escolar: { ...solicitacao.escolar, cpf: '52998224725', nome: 'João da Silva Santos' },
      };
      assert.equal(dadosComprovante(malformado).cpf, '***.982.247-**');
    },
  );

  await t.test('comprovante ausente ou registro inválido não pode ser emitido', () => {
    assert.equal(obterSolicitacao('2026-FFFFFFFF'), null);
    for (const registro of [
      null,
      {},
      { ...solicitacao, protocolo: '' },
      { ...solicitacao, cpf: '' },
      { ...solicitacao, escolar: null },
      { ...solicitacao, criadoEm: 'invalido' },
      { ...solicitacao, status: 'qualquer' },
    ])
      assert.equal(dadosComprovante(registro), null);
  });

  await t.test(
    'evita colisões de protocolo e falhas de gravação não deixam matrícula parcial',
    (t) => {
      const protocoloExistente = solicitacao.protocolo.slice(5).toLowerCase();
      let chamadas = 0;
      t.mock.method(
        crypto,
        'randomUUID',
        () => `${chamadas++ === 0 ? protocoloExistente : 'eeeeeeee'}-0000-4000-8000-000000000000`,
      );
      const segunda = concluirSolicitacao(
        { cpf: '11144477735', nome: 'Aluno Fictício', selecao },
        agora,
      );
      assert.equal(chamadas, 2);
      assert.equal(segunda.protocolo, '2026-EEEEEEEE');
      t.mock.restoreAll();
      const antes = new Map(dados);
      t.mock.method(localStorage, 'setItem', () => {
        throw new Error('Sem espaço');
      });
      assert.throws(
        () => concluirSolicitacao({ cpf: '39053344705', nome: 'Outro Fictício', selecao }, agora),
        /Sem espaço/,
      );
      assert.deepEqual(dados, antes);
    },
  );
});
