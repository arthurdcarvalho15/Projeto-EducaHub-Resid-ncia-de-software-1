import test from 'node:test';
import assert from 'node:assert/strict';
import {
  guardarCpfPreMatricula,
  consumirCpfPreMatricula,
} from '../assets/js/services/pre-matricula.js';

test('CPF temporário é validado, normalizado e consumido uma única vez', (t) => {
  const dados = new Map();
  const anterior = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    value: {
      getItem: (chave) => dados.get(chave) ?? null,
      setItem: (chave, valor) => dados.set(chave, valor),
      removeItem: (chave) => dados.delete(chave),
    },
  });
  t.after(() => {
    if (anterior) Object.defineProperty(globalThis, 'sessionStorage', anterior);
    else delete globalThis.sessionStorage;
  });
  assert.equal(consumirCpfPreMatricula(), '');
  assert.throws(() => guardarCpfPreMatricula('123'));
  assert.equal(dados.size, 0);
  guardarCpfPreMatricula('529.982.247-25');
  assert.equal(consumirCpfPreMatricula(), '52998224725');
  assert.equal(consumirCpfPreMatricula(), '');
  dados.set('educahub:pre-matricula:cpf', '123');
  assert.equal(consumirCpfPreMatricula(), '');
  assert.equal(dados.size, 0);
});
