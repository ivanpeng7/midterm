import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { castleContent, assets, letter } from '../game/castle-content.js';
import { createGame } from '../game/engine.js';
import { validateGameContent } from '../game/validate-content.js';

test('U-01：開場信逐字保留，獨立新局從空道具與結界開始', () => {
  assert.equal(castleContent.room.title, '禁忌實驗室：古堡逃脫');
  assert.deepEqual(letter, ['親愛的學徒：', '實驗似乎發生了意料之外的變化，書房的大門已被結界封鎖。', '我在書房中留下了解開機關的線索。仔細觀察周遭的物品，善用你所學過的知識，相信你一定能找到離開的方法。', '切記，真正的答案往往藏在最不起眼的地方。']);
  const game = createGame();
  assert.equal(game.state.flags.started, false);
  assert.equal(game.state.flags.escaped, false);
  assert.deepEqual(game.state.inventory, []);
  game.start();
  assert.equal(game.state.flags.started, true);
  assert.equal(createGame().state.flags.started, false);
  assert.equal(castleContent.initialState.flags.started, false);
});

test('U-02：正式資料合法，六個物件熱區互不重疊且每個都有回饋', () => {
  assert.deepEqual(validateGameContent(castleContent), []);
  const game = createGame();
  game.start();
  const spots = castleContent.views[0].hotspots;
  assert.deepEqual(spots.map(s => s.id), ['book', 'trash', 'painting', 'chart', 'stars', 'door']);
  for (const [i, spot] of spots.entries()) {
    assert.ok(game.open(spot.id).message.trim());
    for (const other of spots.slice(i + 1)) {
      const [x,y,w,h] = spot.rect;
      const [a,b,c,d] = other.rect;
      assert.ok(x+w <= a || a+c <= x || y+h <= b || b+d <= y, `${spot.id} 與 ${other.id} 重疊`);
    }
  }
});

test('U-03：調查、關閉與取消不改變道具或機關；重新開始還原開場', () => {
  const game = createGame();
  game.start();
  const before = structuredClone(game.state);
  game.open('book');
  game.close();
  assert.deepEqual(game.state, before);
  game.restart();
  assert.deepEqual(game.state, castleContent.initialState);
  assert.notEqual(game.state.flags, castleContent.initialState.flags);
});

test('M-09：16 張素材都使用現有完整路徑，啟動頁面提供真實介面', async () => {
  assert.equal(Object.keys(assets).length, 16);
  for (const src of Object.values(assets)) await access(new URL(`../${src}`, import.meta.url));
  const html = await readFile(new URL('../game/index.html', import.meta.url), 'utf8');
  assert.match(html, /lang="zh-Hant"/);
  assert.match(html, /type="module"/);
  assert.match(html, /明白，開始逃脫！/);
  assert.match(html, /role="status"/);
});
