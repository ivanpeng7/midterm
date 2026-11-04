import test from 'node:test';
import assert from 'node:assert/strict';
import { gameContent } from '../game/game-content.js';
import { createGame } from '../game/engine.js';
import { validateGameContent } from '../game/validate-content.js';

// 隔離的第一版資料案例，補查正式書房沒有使用的 switchView 與通用 take。
function fixture() {
  const c = structuredClone(gameContent);
  Object.assign(c.initialState.flags, { started: false, token_taken: false, token_used: false });
  c.items.push({ id: 'token', name: '測試代幣', description: '僅用於測試的可消耗道具。', consumable: true });
  c.views[0].hotspots.push({id:'token_spot',label:'代幣',rect:[0,0,5,5],interactionId:'take_token'}, {id:'next_spot',label:'往返',rect:[5,0,5,5],interactionId:'to_other'}, {id:'use_spot',label:'使用',rect:[10,0,5,5],interactionId:'use_token'});
  c.views.push({id:'other_view',title:'測試畫面',hotspots:[{id:'return_spot',label:'返回',rect:[0,0,5,5],interactionId:'to_room'}]});
  c.interactions.push(
    {id:'take_token',kind:'take',itemId:'token',onceFlag:'token_taken',feedback:{success:'取得。',repeated:'已取得。'}},
    {id:'to_other',kind:'switchView',toViewId:'other_view',feedback:{success:'切換。'}},
    {id:'to_room',kind:'switchView',toViewId:'room_view',feedback:{success:'返回。'}},
    {id:'use_token',kind:'useItem',itemId:'token',onceFlag:'token_used',onSuccess:[{type:'removeItem',itemId:'token'},{type:'setFlag',flag:'token_used',value:true}],feedback:{success:'已使用。',failure:'需要代幣。',repeated:'已完成。'}}
  );
  return c;
}

test('U-03、I-05：往返只改畫面，消耗道具不能重領，選錯道具不改狀態', () => {
  const game = createGame(fixture()); game.start();
  game.act('take_token'); game.act('take_token');
  assert.deepEqual(game.state.inventory,['token']);
  const before = game.state; game.act('to_other');
  assert.deepEqual(game.state,{...before,viewId:'other_view'});
  game.act('to_room'); assert.deepEqual(game.state,before);
  for (const input of [undefined,'door_key','missing']) { assert.equal(game.act('use_token',input).ok,false); assert.deepEqual(game.state,before); }
  assert.equal(game.act('use_token','token').ok,true);
  game.act('take_token'); game.act('use_token','token');
  assert.deepEqual(game.state.inventory,[]);
  assert.equal(game.state.flags.token_taken,true); assert.equal(game.state.flags.token_used,true);
});
for (const [actionId,fields] of [['take_token',['itemId','onceFlag']],['to_other',['toViewId']]]) {
  for (const field of fields) test(`D-07：${actionId} 不可缺 ${field}`, () => {
    const c=fixture(); delete c.interactions.find(a=>a.id===actionId)[field];
    assert.match(validateGameContent(c).join('\n'),new RegExp(field));
  });
  for (const field of (actionId === 'take_token' ? ['success','repeated'] : ['success'])) test(`D-07：${actionId} 不可缺 ${field} 回饋`, () => {
    const c=fixture(); delete c.interactions.find(a=>a.id===actionId).feedback[field];
    assert.match(validateGameContent(c).join('\n'),new RegExp(field));
  });
}
for (const [name,mutate,path] of [
  ['目標畫面',c=>c.interactions.find(a=>a.id==='to_other').toViewId='missing',/toViewId/],
  ['線索物件',c=>c.clues[0].hotspotId='missing',/hotspotId/],
  ['take 道具',c=>c.interactions.find(a=>a.id==='take_token').itemId='missing',/itemId/]
]) test(`D-02：拒絕不存在的${name}`,()=>{const c=fixture();mutate(c);assert.match(validateGameContent(c).join('\n'),path);});
