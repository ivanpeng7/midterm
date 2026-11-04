import test from 'node:test';
import assert from 'node:assert/strict';
import { constellations } from '../game/constellations.js';
import { createGame } from '../game/engine.js';

test('P-03：十二星座名稱、符號及各自的可畫連線完整', () => {
  assert.deepEqual(constellations.map(({ name, symbol }) => [name,symbol]), [
    ['牡羊座','♈'],['金牛座','♉'],['雙子座','♊'],['巨蟹座','♋'],['獅子座','♌'],['處女座','♍'],
    ['天秤座','♎'],['天蠍座','♏'],['射手座','♐'],['摩羯座','♑'],['水瓶座','♒'],['雙魚座','♓']
  ]);
  for (const c of constellations) {
    assert.ok(c.graph.points.length >= 4);
    assert.ok(c.graph.edges.length >= 3);
    for (const point of c.graph.points) assert.ok(point.length === 2 && point.every(n => Number.isFinite(n) && n >= 0 && n <= 100));
    for (const edge of c.graph.edges) assert.ok(edge.length === 2 && edge.every(n => Number.isInteger(n) && n >= 0 && n < c.graph.points.length));
  }
  assert.equal(new Set(constellations.map(c => JSON.stringify(c.graph))).size, 12);
});

test('I-03、P-03：透鏡取得前不洩漏，切換不消耗道具或重設進度', () => {
  const game = createGame(); game.start();
  const before = game.state;
  assert.equal(game.toggleLens().ok, false);
  assert.deepEqual(game.paintingClues, []);
  assert.deepEqual(game.state, before);
  game.act('solve_box','1976'); game.act('take_lens');
  assert.deepEqual(game.paintingClues, []);
  assert.equal(game.toggleLens().ok, true);
  assert.deepEqual(game.paintingClues.map(c => [c.region,c.symbol]), [['夜空','♌'],['長袍','♋'],['手稿','♏']]);
  for (const clue of game.paintingClues) assert.deepEqual(clue.graph, constellations.find(c => c.symbol === clue.symbol).graph);
  game.close(); game.open('chart'); game.close(); game.open('painting');
  assert.equal(game.paintingClues.length, 3);
  assert.equal(game.toggleLens().ok, true);
  assert.deepEqual(game.paintingClues, []);
  assert.deepEqual(game.state.inventory, ['lens']);
  assert.equal(game.state.flags.box_open, true);
});
