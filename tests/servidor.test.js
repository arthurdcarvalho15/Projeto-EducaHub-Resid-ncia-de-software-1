import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';

test('Servidor entrega rotas, módulos e erros sem expor arquivos internos', async (t) => {
  const child = spawn(
    process.execPath,
    [fileURLToPath(new URL('../tools/server.mjs', import.meta.url)), '--port', '0'],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );
  t.after(() => child.kill());
  const [output] = await once(child.stdout, 'data');
  const base = output
    .toString()
    .match(/http:\/\/localhost:\d+/)[0]
    .replace('localhost', '127.0.0.1');
  const cases = [
    ['/', 200, 'text/html'],
    ['/aluno/notas/', 200, 'text/html'],
    ['/entrar/professor/', 200, 'text/html'],
    ['/cadastrar/', 200, 'text/html'],
    ['/assets/js/cadastro.js', 200, 'text/javascript'],
    ['/assets/css/formularios.css', 200, 'text/css'],
    ['/pagina-inexistente/', 404, 'text/html'],
    ['/.migration/astro-original.zip', 404, null],
    ['/package.json', 404, null],
  ];
  for (const [route, code, type] of cases) {
    const response = await fetch(base + route);
    assert.equal(response.status, code, route);
    if (type) assert.ok(response.headers.get('content-type').startsWith(type), route);
  }
  const redirect = await fetch(base + '/aluno?origem=teste', { redirect: 'manual' });
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get('location'), '/aluno/?origem=teste');
  assert.equal((await fetch(base + '/', { method: 'HEAD' })).status, 200);
  assert.equal(await (await fetch(base + '/', { method: 'HEAD' })).text(), '');
  assert.equal((await fetch(base + '/', { method: 'POST' })).status, 405);
});
