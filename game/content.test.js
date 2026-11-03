import test from 'node:test';
import assert from 'node:assert/strict';
import { gameContent } from './game-content.js';
import { validateGameContent } from './validate-content.js';

const copy = () => structuredClone(gameContent);

test('範例房間符合第一版內容格式', () => {
  assert.deepEqual(validateGameContent(gameContent), []);
});

test('缺少必要欄位時指出資料位置', () => {
  const content = copy();
  delete content.room.startViewId;
  assert.match(validateGameContent(content).join('\n'), /room\.startViewId/);
});

test('不支援的版本會被拒絕', () => {
  const content = copy();
  content.schemaVersion = 2;
  assert.match(validateGameContent(content).join('\n'), /schemaVersion/);
});

test('重複識別碼會被拒絕', () => {
  const content = copy();
  content.items[0].id = content.room.id;
  assert.match(validateGameContent(content).join('\n'), /items\[0\]\.id/);
});

test('不存在的互動、線索和道具引用會被拒絕', () => {
  const content = copy();
  content.views[0].hotspots[0].interactionId = 'missing_action';
  content.puzzles[0].clueIds[0] = 'missing_clue';
  content.interactions[2].itemId = 'missing_item';
  const errors = validateGameContent(content).join('\n');
  assert.match(errors, /views\[0\]\.hotspots\[0\]\.interactionId/);
  assert.match(errors, /puzzles\[0\]\.clueIds\[0\]/);
  assert.match(errors, /interactions\[2\]\.itemId/);
});

test('超出場景或零尺寸的可點擊區域會被拒絕', () => {
  const content = copy();
  content.views[0].hotspots[0].rect = [95, 10, 10, 0];
  assert.match(validateGameContent(content).join('\n'), /views\[0\]\.hotspots\[0\]\.rect/);
});

test('未宣告的旗標和沒有完成效果的謎題會被拒絕', () => {
  const content = copy();
  content.puzzles[0].solvedFlag = 'unknown_flag';
  content.puzzles[0].onSolved = [{ type: 'addItem', itemId: 'door_key' }];
  const errors = validateGameContent(content).join('\n');
  assert.match(errors, /puzzles\[0\]\.solvedFlag/);
  assert.match(errors, /puzzles\[0\]\.onSolved/);
});

test('多餘或拼錯的欄位會被拒絕', () => {
  const content = copy();
  content.items[0].itemID = 'door_key';
  assert.match(validateGameContent(content).join('\n'), /items\[0\]\.itemID/);
});
