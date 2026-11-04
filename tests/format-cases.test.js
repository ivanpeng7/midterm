import test from 'node:test';
import assert from 'node:assert/strict';
import { gameContent } from '../game/game-content.js';
import { validateGameContent, loadGameContent } from '../game/validate-content.js';

const reject = (mutate, path) => { const data = structuredClone(gameContent); mutate(data); assert.match(validateGameContent(data).join('\n'), path); assert.throws(() => loadGameContent(data), /遊戲內容載入失敗/); };

for (const rect of [[95,25,12,15], [0,0,0,5], [0,0,5,0], [-1,0,5,5], [0,'a',5,5], [0,0,5], [0,0,Infinity,5]]) test(`D-03：拒絕熱區 ${JSON.stringify(rect)}`, () => reject(c => { c.views[0].hotspots[0].rect = rect; }, /rect/));
test('D-03：熱區可剛好貼邊', () => { const c = structuredClone(gameContent); c.views[0].hotspots[0].rect = [90,90,10,10]; assert.deepEqual(validateGameContent(c), []); });
for (const [label, mutate, path] of [
  ['D-04 空文字', c => c.room.title = ' ', /room.title/],
  ['D-04 布林文字', c => c.items[0].consumable = 'false', /consumable/],
  ['D-04 陣列型別', c => c.items = {}, /items/],
  ['D-05 效果道具引用', c => c.puzzles[0].onSolved[1].itemId = 'missing', /onSolved.*itemId/],
  ['D-05 未知效果', c => c.puzzles[0].onSolved.push({ type: 'teleport' }), /onSolved.*type/],
  ['D-05 不得重設完成旗標', c => c.puzzles[0].onSolved.push({ type: 'setFlag', flag: 'drawer_open', value: false }), /onSolved.*value/],
  ['D-06 新局道具非空', c => c.initialState.inventory = ['door_key'], /inventory/],
  ['D-06 提前通關', c => c.initialState.flags.escaped = true, /escaped/],
  ['D-06 起始畫面不一致', c => c.initialState.viewId = 'other', /viewId/],
  ['D-07 inspect 對應錯位', c => c.clues[0].hotspotId = 'door', /clueId/],
  ['D-07 謎題對應錯位', c => c.puzzles[0].targetHotspotId = 'door', /puzzleId/],
  ['D-09 不可消耗道具', c => c.interactions[2].onSuccess.push({ type: 'removeItem', itemId: 'door_key' }), /itemId/]
]) test(label, () => reject(mutate, path));

for (const [index, fields] of [[0,['clueId']], [1,['puzzleId']], [2,['itemId','onceFlag','onSuccess']]]) {
  for (const field of fields) test(`D-07：互動 ${index} 不可缺 ${field}`, () => reject(c => { delete c.interactions[index][field]; }, new RegExp(field)));
  for (const key of (index === 0 ? ['success'] : ['success','failure','repeated'])) test(`D-07：互動 ${index} 不可缺 ${key} 提示`, () => reject(c => { delete c.interactions[index].feedback[key]; }, new RegExp(key)));
}
for (const answer of [427, '', '04 27', '０４２７']) test(`D-08：拒絕密碼資料 ${JSON.stringify(answer)}`, () => reject(c => { c.puzzles[0].answer = answer; }, /answer/));
test('D-08～D-10：合法前導零、可消耗道具與載入', () => {
  const c = structuredClone(gameContent);
  c.items[0].consumable = true;
  c.interactions[2].onSuccess.push({ type: 'removeItem', itemId: 'door_key' });
  assert.equal(c.puzzles[0].answer, '0427');
  assert.deepEqual(validateGameContent(c), []);
  assert.equal(loadGameContent(c), c);
});
