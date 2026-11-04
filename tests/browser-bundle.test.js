import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Script } from 'node:vm';
import { createBrowserBundle } from '../game/build-browser.js';

test('T-05：直接開檔的程式必須由目前模組產生，不能沿用舊版本', async () => {
  const actual = await readFile(new URL('../game/browser.js', import.meta.url), 'utf8');
  assert.equal(actual.replaceAll('\r\n','\n'), await createBrowserBundle());
  assert.doesNotThrow(() => new Script(actual), '產物必須是不需模組載入的普通 JavaScript');
  for (const text of ['親愛的學徒：','1976','日守天頂，月循右方，雙曜歸位，結界自解。']) assert.ok(actual.includes(text));
});
