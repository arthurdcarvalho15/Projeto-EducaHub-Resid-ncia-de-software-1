import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const folders = [
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
  'tools',
  'tests',
];
async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name))),
    )
  ).flat();
}
const files = [
  path.join(root, 'index.html'),
  path.join(root, '404.html'),
  ...(await Promise.all(folders.map((f) => walk(path.join(root, f))))).flat(),
];
const errors = [];
async function localReference(from, ref) {
  if (!ref || /^(#|https?:|mailto:|tel:|data:)/.test(ref)) return;
  const clean = decodeURIComponent(
    ref.replaceAll('&quot;', '').replaceAll('&#39;', '').replaceAll('&amp;', '&').split(/[?#]/)[0],
  );
  let target = clean.startsWith('/')
    ? path.join(root, clean.slice(1))
    : path.resolve(path.dirname(from), clean);
  try {
    if ((await fs.stat(target)).isDirectory()) target = path.join(target, 'index.html');
    await fs.access(target);
  } catch {
    errors.push(`${path.relative(root, from)}: arquivo ausente ${ref}`);
  }
}
let pages = 0;
for (const file of files) {
  const ext = path.extname(file);
  if (['.js', '.mjs'].includes(ext)) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.status) errors.push(result.stderr);
    if (file.includes(path.sep + 'assets' + path.sep)) {
      const source = await fs.readFile(file, 'utf8');
      for (const m of source.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g))
        await localReference(file, m[1]);
    }
  }
  if (ext === '.html') {
    pages++;
    const html = await fs.readFile(file, 'utf8');
    if (/<astro-island|\/_astro\/|astro:|import\.meta\.env/.test(html))
      errors.push(`${file}: dependência do framework antigo`);
    const ids = [...html.matchAll(/(?<![\w-])id="([^"]+)"/g)].map((m) => m[1]);
    if (new Set(ids).size !== ids.length) errors.push(`${file}: IDs duplicados`);
    for (const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) await localReference(file, m[1]);
    for (const m of html.matchAll(/url\(["']?([^\s)"']+)["']?\)/g))
      await localReference(file, m[1]);
  }
  if (ext === '.css') {
    const css = await fs.readFile(file, 'utf8');
    for (const m of css.matchAll(/url\(["']?([^\s)"']+)["']?\)/g)) await localReference(file, m[1]);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else
  console.log(`${pages} páginas verificadas; JavaScript válido e referências locais existentes.`);
