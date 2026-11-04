import test from 'node:test';
import assert from 'node:assert/strict';
import { castleContent } from '../game/castle-content.js';
import { validateGameContent } from '../game/validate-content.js';

for (const [name, mutate, path] of [
  ['線索編號不可空白', c => c.puzzles[0].clueIds = [' '], /clueIds/],
  ['目標區域不可空白', c => c.puzzles[0].targetHotspotId = '', /targetHotspotId/],
  ['效果道具不可空白', c => c.interactions.find(a => a.id === 'insert_crystal').onSuccess[0].itemId = '', /itemId/],
  ['前置旗標不可空白', c => c.interactions.find(a => a.id === 'take_lens').requiresFlags = [''], /requiresFlags/],
  ['方向順序不可顛倒', c => c.puzzles.find(p => p.id === 'sun_moon').answer = 'right,up', /answer/],
  ['方向答案不可為物件', c => c.puzzles.find(p => p.id === 'sun_moon').answer = { sun: 'up', moon: 'right' }, /answer/],
  ['方向互動不可連到數字題', c => c.interactions.find(a => a.id === 'solve_door').puzzleId = 'box_code', /puzzleId/],
  ['有前置條件的拿取需失敗回饋', c => { delete c.interactions.find(a => a.id === 'take_lens').feedback.failure; }, /feedback.failure/],
  ['完成效果不能重鎖其他機關', c => c.interactions.find(a => a.id === 'insert_crystal').onSuccess.push({type:'setFlag',flag:'painting_open',value:false}), /onSuccess.*value/]
]) test(`D-02、D-05、D-07、T-02：${name}`, () => {
  const c = structuredClone(castleContent); mutate(c);
  assert.match(validateGameContent(c).join('\n'), path);
});
