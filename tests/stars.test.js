import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame } from '../game/engine.js';
import { castleContent } from '../game/castle-content.js';
import { validateGameContent } from '../game/validate-content.js';

const prepared = () => { const game = createGame(); game.start(); game.act('solve_box','1976'); game.act('take_lens'); game.toggleLens(); game.open('painting'); return game; };
const correct = [['♌','♋','♏'],['♌','♏','♋'],['♋','♌','♏'],['♋','♏','♌'],['♏','♌','♋'],['♏','♋','♌']];
for (const symbols of correct) test(`P-04：獨立新局接受排列 ${symbols.join('')}`, () => {
  const game = prepared();
  assert.equal(game.act('solve_stars', symbols).ok, true);
  assert.equal(game.state.flags.painting_open, true);
  assert.deepEqual(game.state.inventory, ['lens']);
  assert.equal(game.act('take_crystal').ok, true);
  assert.match(game.describe('crystal'), /左.*金.*右.*銀/);
  game.act('take_crystal'); game.act('solve_stars', symbols); game.close(); game.open('painting');
  assert.deepEqual(game.state.inventory, ['lens','crystal']);
});
for (const symbols of [['♌','♌','♋'],['♋','♋','♏'],['♏','♏','♌'],['♈','♉','♊'],['♌','♋','♈'],[],['♌','♋'],['♌','♋','♏','♌'],['♌','♋',null], '♌♋♏']) test(`P-04：拒絕 ${JSON.stringify(symbols)} 且可改正`, () => {
  const game = prepared(); const before = game.state;
  assert.equal(game.act('solve_stars', symbols).ok, false);
  assert.deepEqual(game.state, before);
  assert.equal(game.act('solve_stars', ['♌','♋','♏']).ok, true);
});
test('I-04、P-05：未完成前置不能開暗格或取水晶，連點不重發', () => {
  const game = createGame(); game.start();
  assert.equal(game.act('solve_stars',['♌','♋','♏']).ok, false);
  assert.equal(game.act('take_crystal').ok, false);
  game.act('solve_box','1976'); game.act('take_lens');
  assert.equal(game.act('solve_stars',['♌','♋','♏']).ok, false);
  game.toggleLens(); game.open('painting');
  assert.equal(game.act('solve_stars',['♌','♋','♏']).ok, true);
  for (let i = 0; i < 5; i++) { game.act('take_crystal'); game.act('solve_stars',['♌','♋','♏']); }
  assert.equal(game.state.inventory.filter(id => id === 'crystal').length, 1);
});
test('T-02：星座格式明確宣告，拒絕重複符號、未知型別與錯誤前置引用', () => {
  const puzzle = castleContent.puzzles.find(p => p.id === 'star_symbols');
  assert.ok(puzzle);
  assert.equal(puzzle.answerType, 'symbols');
  assert.equal(puzzle.answer, '♌♋♏');
  assert.deepEqual(validateGameContent(castleContent), []);
  for (const [mutate,path] of [
    [c => c.puzzles.find(p => p.id === 'star_symbols').answer = '♌♌♋', /answer/],
    [c => c.puzzles.find(p => p.id === 'star_symbols').answerType = 'unknown', /answerType/],
    [c => c.interactions.find(a => a.id === 'take_crystal').requiresFlags = ['missing'], /requiresFlags/]
  ]) { const c = structuredClone(castleContent); mutate(c); assert.match(validateGameContent(c).join('\n'), path); }
});
