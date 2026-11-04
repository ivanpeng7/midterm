import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// 只組合本專案的五個模組，順序即其相依順序；不安裝額外建置套件。
const moduleFiles = ['constellations.js', 'castle-content.js', 'validate-content.js', 'engine.js', 'app.js'];

export async function createBrowserBundle() {
  const loaded = new Set();
  const sources = [];
  for (const file of moduleFiles) {
    const url = new URL(file, import.meta.url);
    let source = (await readFile(url, 'utf8')).replaceAll('\r\n', '\n');
    source = source.replace(/^import .+ from ['"](.+)['"];[ \t]*\n/gm, (line, dependency) => {
      if (!loaded.has(new URL(dependency, url).href)) throw new Error(`${file}：相依模組 ${dependency} 尚未載入`);
      return '';
    }).replace(/^export (?=(?:const|function)\s)/gm, '');
    if (/^(?:import|export)\s/m.test(source)) throw new Error(`${file}：出現尚未支援的模組語法，請先擴充產生方式及測試`);
    sources.push(`// 來源：${file}\n${source.trimEnd()}\n`);
    loaded.add(url.href);
  }
  return `// 自動產生：請修改原始模組，再執行 node game/build-browser.js。\n(() => {\n'use strict';\n${sources.join('\n')}\n})();\n`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await writeFile(new URL('./browser.js', import.meta.url), await createBrowserBundle(), 'utf8');
  console.log('已更新 game/browser.js，直接開啟 index.html 即可遊玩。');
}
