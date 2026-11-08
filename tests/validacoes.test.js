import test from 'node:test';
import assert from 'node:assert/strict';
import { cpfValidator } from '../assets/js/utils/cpfValidator.js';
import { formatarCpf, idadeNaData } from '../assets/js/formularios.js';

test('CPF aceita verificadores corretos e rejeita alterações e sequências repetidas', () => {
  assert.equal(cpfValidator('529.982.247-25'), true);
  assert.equal(cpfValidator('52998224725'), true);
  for (const cpf of ['529.982.247-24', '111.111.111-11', '00000000000', '123', ''])
    assert.equal(cpfValidator(cpf), false);
  assert.equal(formatarCpf('52998224725'), '529.982.247-25');
});
test('Maioridade muda no aniversário, em calendário local', () => {
  const hoje = new Date(2026, 10, 5, 12);
  assert.equal(idadeNaData('2008-11-05', hoje), 18);
  assert.equal(idadeNaData('2008-11-06', hoje), 17);
  assert.equal(idadeNaData('2008-11-04', hoje), 18);
  assert.equal(idadeNaData('2026-11-06', hoje), null);
  assert.equal(idadeNaData('2025-02-29', hoje), null);
  assert.equal(idadeNaData('', hoje), null);
});
