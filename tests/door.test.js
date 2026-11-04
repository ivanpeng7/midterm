import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame } from '../game/engine.js';
import { castleContent } from '../game/castle-content.js';

const withCrystal = () => {
  const game = createGame(); game.start(); game.act('solve_box','1976'); game.act('take_lens'); game.toggleLens(); game.open('painting'); game.act('solve_stars',['♌','♋','♏']); game.act('take_crystal'); return game;
};
test('S-01：缺水晶、持有但未插入或選錯道具，都不能操作方向或通關', () => {
  for (const game of [createGame(), withCrystal()]) {
    game.start(); const before = game.state;
    assert.equal(game.setDirection('sun','up').ok, false);
    assert.equal(game.act('insert_crystal', 'lens').ok, false);
    assert.equal(game.act('solve_door').ok, false);
    assert.deepEqual(game.state, before);
  }
});
test('S-02：水晶插入一次，從道具欄移除，重複拾取與插入不復製', () => {
  const game = withCrystal();
  assert.equal(castleContent.items.find(item => item.id === 'crystal').consumable, true);
  assert.equal(game.act('insert_crystal','crystal').ok, true);
  const before = game.state;
  game.act('insert_crystal','crystal'); game.act('take_crystal');
  assert.deepEqual(game.state, before);
  assert.equal(game.state.flags.crystal_inserted, true);
  assert.equal(game.state.inventory.includes('crystal'), false);
});
for (const [sun,moon,escaped] of [['up','right',true],['up','left',false],['down','right',false],['down','left',false]]) test(`S-03：太陽 ${sun}、月亮 ${moon} → ${escaped}`, () => {
  const game = withCrystal(); game.act('insert_crystal','crystal');
  assert.equal(game.setDirection('sun',sun).ok, true);
  assert.equal(game.setDirection('moon',moon).ok, true);
  const before = game.state;
  assert.equal(game.act('solve_door').ok, escaped);
  assert.equal(game.state.flags.escaped, escaped);
  if (!escaped) {
    assert.deepEqual(game.state,before);
    game.close(); game.open('door');
    game.setDirection('sun','up'); game.setDirection('moon','right');
    assert.equal(game.act('solve_door').ok, true);
  }
});
test('S-03：拒絕軸向不符與未知控制，進度不變', () => {
  const game = withCrystal(); game.act('insert_crystal','crystal'); const before = game.state;
  for (const args of [['sun','left'],['moon','up'],['other','right'],['sun',null]]) assert.equal(game.setDirection(...args).ok, false);
  assert.deepEqual(game.state,before);
});
test('S-04：通關後所有舊機關與開始操作不改進度', () => {
  const game = withCrystal(); game.act('insert_crystal','crystal'); game.setDirection('sun','up'); game.setDirection('moon','right');
  assert.equal(game.act('solve_door').ok,true);
  const before = game.state;
  for (const [id,input] of [['solve_door'],['take_crystal'],['insert_crystal','crystal'],['solve_stars',['♌','♋','♏']],['solve_box','1976']]) assert.equal(game.act(id,input).ok,false);
  game.setDirection('sun','down'); game.toggleLens(); game.start(); game.open('book');
  assert.deepEqual(game.state,before);
});
test('S-05、S-06：三個階段關閉重開保存進度，中途與勝利後重開清空', () => {
  const original = structuredClone(castleContent.initialState);
  for (const phase of ['box','crystal','inserted','escaped']) {
    const game = phase === 'box' ? createGame() : withCrystal();
    if (phase === 'box') { game.start(); game.act('solve_box','1976'); }
    if (['inserted','escaped'].includes(phase)) game.act('insert_crystal','crystal');
    if (phase === 'escaped') { game.setDirection('sun','up'); game.setDirection('moon','right'); game.act('solve_door'); }
    const before = game.state;
    for (const panel of ['book','chart','door']) { game.close(); game.open(panel); }
    assert.deepEqual(game.state,before);
    game.restart(); assert.deepEqual(game.state,original); assert.notEqual(game.state.flags,original.flags);
  }
  assert.deepEqual(castleContent.initialState,original);
});
