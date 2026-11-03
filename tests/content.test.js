import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { gameContent } from '../game/game-content.js';
import { loadGameContent, validateGameContent } from '../game/validate-content.js';

const copy = () => structuredClone(gameContent);

test('package.json 提供 npm test 指令', async () => {
  const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(packageJson.scripts.test, 'node --test');
  assert.equal(packageJson.type, 'module');
});

test('範例內容能載入', () => {
  assert.deepEqual(validateGameContent(gameContent), []);
  assert.equal(loadGameContent(gameContent), gameContent);
});

test('缺少必要欄位會被拒絕', () => {
  const content = copy();
  delete content.room.title;
  assert.match(validateGameContent(content).join('\n'), /room\.title.*缺少必要欄位/);
});

test('重複識別碼會被拒絕', () => {
  const content = copy();
  content.items[0].id = content.room.id;
  assert.match(validateGameContent(content).join('\n'), /重複/);
});

test('無效引用會被拒絕', () => {
  const content = copy();
  content.room.startViewId = 'missing_view';
  assert.match(validateGameContent(content).join('\n'), /room\.startViewId.*找不到畫面/);
});

test('越界座標會被拒絕', () => {
  const content = copy();
  content.views[0].hotspots[0].rect = [95, 25, 12, 15];
  assert.match(validateGameContent(content).join('\n'), /rect.*超出/);
});
