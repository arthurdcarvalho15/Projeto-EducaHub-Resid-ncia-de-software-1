import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
// Fixed output directory inside the project; the source files are never removed.
if (path.dirname(output) !== root || path.basename(output) !== 'dist')
  throw new Error('Destino inválido');
await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(output, { recursive: true });
for (const name of [
  'assets',
  'aluno',
  'cadastrar',
  'entrar',
  'escola',
  'login',
  'professor',
  'recuperar-senha',
  'responsavel',
  'secretaria',
  'index.html',
  '404.html',
  'favicon.svg',
]) {
  await fs.cp(path.join(root, name), path.join(output, name), { recursive: true });
}
const basePath = process.env.PAGES_BASE_PATH || '';
if (basePath && !/^\/[A-Za-z0-9._-]+$/.test(basePath))
  throw new Error('PAGES_BASE_PATH deve ter o formato /nome-do-repositorio');
if (basePath) {
  const prefixes =
    'assets|aluno|cadastrar|entrar|escola|login|professor|recuperar-senha|responsavel|secretaria|favicon\\.svg|404\\.html|index\\.html';
  const absolutePath = new RegExp(`(["'\x60])/(?!/)(?=(?:${prefixes})(?:/|["'\x60]))`, 'g');
  async function rewrite(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await rewrite(file);
      } else if (/\.(?:html|css|js)$/.test(entry.name)) {
        let content = await fs.readFile(file, 'utf8');
        content = content.replace(absolutePath, `$1${basePath}/`);
        if (entry.name.endsWith('.html')) {
          content = content.replaceAll('href="/"', `href="${basePath}/"`);
          content = content.replaceAll('href="/#', `href="${basePath}/#`);
          if (process.env.PAGES_ORIGIN)
            content = content.replaceAll(
              'http://localhost:4321',
              `${process.env.PAGES_ORIGIN}${basePath}`,
            );
        }
        await fs.writeFile(file, content);
      }
    }
  }
  await rewrite(output);
  await fs.writeFile(path.join(output, '.nojekyll'), '');
}
console.log('Site estático copiado para dist/. Sem compilação ou dependências de execução.');
