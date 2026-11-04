import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep, extname } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.flac': 'audio/flac' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/' || pathname === '/game/') { response.writeHead(302, { Location: '/game/index.html' }); response.end(); return; }
    const target = resolve(root, `.${pathname}`);
    if (!target.startsWith(root.endsWith(sep) ? root : root + sep)) { response.writeHead(403); response.end(); return; }
    const data = await readFile(target);
    const headers = { 'Content-Type': types[extname(target)] ?? 'application/octet-stream', 'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes' };
    let start = 0, end = data.length - 1, status = 200;
    if (request.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
      if (match) {
        start = match[1] ? Number(match[1]) : Math.max(0, data.length - Number(match[2]));
        end = match[1] && match[2] ? Math.min(Number(match[2]), data.length - 1) : data.length - 1;
      }
      if (!match || (!match[1] && !match[2]) || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= data.length) {
        response.writeHead(416, { ...headers, 'Content-Range': `bytes */${data.length}`, 'Content-Length': 0 }); response.end(); return;
      }
      status = 206; headers['Content-Range'] = `bytes ${start}-${end}/${data.length}`;
    }
    headers['Content-Length'] = Math.max(0, end - start + 1);
    response.writeHead(status, headers);
    response.end(request.method === 'HEAD' ? undefined : data.subarray(start, end + 1));
  } catch { response.writeHead(404); response.end('找不到檔案'); }
});
server.listen(Number(process.env.PORT ?? 4173), '127.0.0.1', () => console.log(`遊戲網址：http://127.0.0.1:${server.address().port}/game/index.html`));
server.on('error', error => { console.error(`無法啟動：${error.message}`); process.exitCode = 1; });
