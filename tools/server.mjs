import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = process.argv.includes('--dist') ? path.join(project, 'dist') : project;
const portArg = process.argv.indexOf('--port');
const port = Number(portArg >= 0 ? process.argv[portArg + 1] : process.env.PORT || 4321);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.json': 'application/json; charset=utf-8',
};
export const server = http.createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end();
    return;
  }
  try {
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    // Only serve public site files, never source tooling or the original backup.
    const segments = pathname.split('/').filter(Boolean);
    if (
      segments.some((s) => s.startsWith('.') || s.includes('\\')) ||
      !(
        !segments.length ||
        [
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
        ].includes(segments[0])
      )
    ) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(req.method === 'HEAD' ? undefined : await fs.readFile(path.join(root, '404.html')));
      return;
    }
    let target = path.resolve(root, '.' + pathname);
    if (target !== root && !target.startsWith(root + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    let code = 200;
    try {
      const stat = await fs.stat(target);
      if (stat.isDirectory()) {
        if (!pathname.endsWith('/')) {
          res.writeHead(301, { Location: url.pathname + '/' + url.search });
          res.end();
          return;
        }
        target = path.join(target, 'index.html');
      }
      await fs.access(target);
    } catch {
      target = path.join(root, '404.html');
      code = 404;
    }
    const content = await fs.readFile(target);
    res.writeHead(code, {
      'Content-Type': types[path.extname(target)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
    });
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch {
    res.writeHead(400);
    res.end('Requisição inválida');
  }
});
server.listen(port, '127.0.0.1', () =>
  console.log(`EducaHub em http://localhost:${server.address().port} — Ctrl+C para encerrar.`),
);
server.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
