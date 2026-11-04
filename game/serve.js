import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep, extname } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const target = resolve(root, `.${pathname === '/' ? '/game/index.html' : pathname}`);
    if (!target.startsWith(root.endsWith(sep) ? root : root + sep)) { response.writeHead(403); response.end(); return; }
    const data = await readFile(target);
    response.writeHead(200, { 'Content-Type': types[extname(target)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(data);
  } catch { response.writeHead(404); response.end('找不到檔案'); }
});
server.listen(4173, '127.0.0.1', () => console.log('遊戲網址：http://127.0.0.1:4173/game/index.html'));
server.on('error', error => { console.error(`無法啟動：${error.message}`); process.exitCode = 1; });
