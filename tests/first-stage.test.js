import test from 'node:test';
import assert from 'node:assert/strict';
import { castleContent, poem, directionHint } from '../game/castle-content.js';
import { createGame, applyEffects } from '../game/engine.js';

const fresh = () => { const game = createGame(); game.start(); return game; };

test('I-01：書本保留原詩、1976 與日月提示，取得道具後仍可重讀', () => {
  assert.deepEqual(poem, ['樂音迴響古堡間，', '色彩斑斕幻影連，', '桶中暗藏玄機在，', '內尋方知鎖鎖牽。']);
  assert.equal(poem.map(line => line[0]).join(''), '樂色桶內');
  assert.equal(directionHint, '日守天頂，月循右方，雙曜歸位，結界自解。');
  const game = fresh();
  const text = game.open('book').message;
  for (const line of [...poem, directionHint, '1976']) assert.ok(text.includes(line));
  game.act('solve_box', '1976'); game.act('take_lens');
  assert.equal(game.open('book').message, text);
  game.close();
  assert.equal(game.open('book').message, text);
});

for (const answer of ['1976', ' 1976 ']) test(`P-01：${JSON.stringify(answer)} 開箱後可取一份透鏡`, () => {
  const game = fresh();
  assert.equal(game.act('take_lens').ok, false);
  assert.equal(game.act('solve_box', answer).ok, true);
  assert.deepEqual(game.state.inventory, []);
  assert.equal(game.act('take_lens').ok, true);
  game.act('take_lens'); game.act('solve_box', '1976');
  game.close(); game.open('trash');
  assert.deepEqual(game.state.inventory, ['lens']);
  assert.match(game.describe('lens'), /黃銅.*單眼鏡片.*12 公分/);
});

for (const answer of ['1234', '0000', '', '197', '19760', '19 76', '１９７６', null, 1976]) test(`P-02：${JSON.stringify(answer)} 不改進度且可重試`, () => {
  const game = fresh();
  const before = game.state;
  assert.equal(game.act('solve_box', answer).ok, false);
  assert.deepEqual(game.state, before);
  game.close();
  assert.equal(game.act('solve_box', '1976').ok, true);
  assert.equal(game.act('take_lens').ok, true);
});

test('I-05：效果整組驗證後才生效，道具不重複；只能移除持有且可消耗道具', () => {
  const content = { items: [{ id: 'token', consumable: true }, { id: 'lens', consumable: false }] };
  const state = { viewId: 'study', inventory: ['token', 'lens'], flags: { taken: true, escaped: false } };
  const original = structuredClone(state);
  const duplicate = applyEffects(state, [{ type: 'addItem', itemId: 'lens' }], content);
  assert.deepEqual(duplicate.inventory, ['token', 'lens']);
  const removed = applyEffects(state, [{ type: 'removeItem', itemId: 'token' }], content);
  assert.deepEqual(removed.inventory, ['lens']);
  assert.equal(removed.flags.taken, true);
  for (const effects of [
    [{ type: 'removeItem', itemId: 'lens' }],
    [{ type: 'removeItem', itemId: 'unknown' }],
    [{ type: 'addItem', itemId: 'unknown' }],
    [{ type: 'removeItem', itemId: 'token' }, { type: 'setFlag', flag: 'missing', value: true }],
    [{ type: 'removeItem', itemId: 'token' }, { type: 'removeItem', itemId: 'token' }],
    [{ type: 'setFlag', flag: 'taken', value: false }],
    [{ type: 'unknown' }]
  ]) {
    assert.throws(() => applyEffects(state, effects, content));
    assert.deepEqual(state, original);
  }
  assert.throws(() => applyEffects(removed, [{ type: 'removeItem', itemId: 'token' }], content));
});
