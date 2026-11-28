import test from 'node:test';
import assert from 'node:assert/strict';
import { alunoCadastrado, registrarPreMatricula } from '../assets/js/services/alunos.js';
import { cpfValidator } from '../assets/js/utils/cpfValidator.js';
import { formatarCpf } from '../assets/js/formularios.js';

test('Consulta e pré-matrícula usam apenas registros locais de alunos', async (t) => {
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

  await t.test('vazio, curto, letras, repetidos e verificadores inválidos não são aceitos', () => {
    for (const cpf of ['', '123', 'abcdefghijk', '11111111111', '52998224724']) {
      assert.equal(cpfValidator(cpf), false);
      assert.equal(alunoCadastrado(cpf), false);
      assert.throws(() => registrarPreMatricula(cpf));
    }
    assert.equal(formatarCpf('abc123'), '123');
    assert.equal(dados.size, 0);
  });

  await t.test('armazenamento vazio e consulta não criam cadastro', () => {
    assert.equal(alunoCadastrado('52998224725'), false);
    assert.equal(dados.size, 0);
  });

  await t.test('encontra CPF com e sem pontuação sem consultar outros perfis', () => {
    dados.set(
      'educahub:alunos:v1',
      JSON.stringify([{ cpf: '529.982.247-25', nome: 'Aluno fictício' }]),
    );
    dados.set('educahub:professores-escola:v1', JSON.stringify([{ cpf: '111.444.777-35' }]));
    assert.equal(alunoCadastrado('52998224725'), true);
    assert.equal(alunoCadastrado('529.982.247-25'), true);
    assert.equal(alunoCadastrado('11144477735'), false);
    dados.set('educahub:alunos:v1', JSON.stringify([{ cpf: '52998224725' }]));
    assert.equal(alunoCadastrado('529.982.247-25'), true);
  });

  await t.test('duplicidade é bloqueada e demais dados são preservados', () => {
    const antes = new Map(dados);
    assert.equal(registrarPreMatricula('529.982.247-25'), false);
    assert.deepEqual(dados, antes);
    assert.equal(registrarPreMatricula('111.444.777-35'), true);
    assert.equal(alunoCadastrado('11144477735'), true);
    assert.equal(registrarPreMatricula('11144477735'), false);
    assert.equal(JSON.parse(dados.get('educahub:alunos:v1')).length, 2);
    assert.equal(
      dados.get('educahub:professores-escola:v1'),
      antes.get('educahub:professores-escola:v1'),
    );
  });

  await t.test('dados corrompidos ou em formato inesperado não são sobrescritos', () => {
    for (const valor of ['{', '{}', 'null']) {
      dados.set('educahub:alunos:v1', valor);
      assert.throws(() => alunoCadastrado('52998224725'));
      assert.throws(() => registrarPreMatricula('52998224725'));
      assert.equal(dados.get('educahub:alunos:v1'), valor);
    }
  });

  await t.test('falha de leitura impede identificar o CPF como novo', (t) => {
    t.mock.method(localStorage, 'getItem', () => {
      throw new Error('Armazenamento bloqueado');
    });
    assert.throws(() => alunoCadastrado('52998224725'));
    assert.throws(() => registrarPreMatricula('52998224725'));
  });

  await t.test('falha de gravação não informa conclusão nem cria registro', (t) => {
    dados.delete('educahub:alunos:v1');
    t.mock.method(localStorage, 'setItem', () => {
      throw new Error('Sem espaço');
    });
    assert.throws(() => registrarPreMatricula('52998224725'));
    assert.equal(dados.has('educahub:alunos:v1'), false);
  });
});
