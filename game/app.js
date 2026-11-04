import { castleContent, assets, letter, poem, directionHint } from './castle-content.js';
import { createGame } from './engine.js';
import { constellations, drawGraph } from './constellations.js';

const $ = selector => document.querySelector(selector);
const src = key => `../${assets[key]}`;
let game;
let lastFocus;
const say = result => { $('#message').textContent = result.message; $('#panel-message').textContent = result.message; };
const image = (key, alt) => `<div class="art"><img src="${src(key)}" alt="${alt}"></div>`;

function render() {
  const state = game.state;
  $('#room-image').src = src(state.flags.escaped ? 'ending' : 'study');
  $('#ending').hidden = !state.flags.escaped;
  $('#hotspots').hidden = state.flags.escaped;
  $('#inventory').replaceChildren();
  if (!state.inventory.length) $('#inventory').innerHTML = '<p>尚未取得道具</p>';
  for (const id of state.inventory) {
    const item = castleContent.items.find(item => item.id === id);
    const button = document.createElement('button');
    button.className = 'inventory-item quiet';
    button.innerHTML = `<img src="${src(id)}" alt=""><span>查看${item.name}</span>`;
    button.addEventListener('click', () => { say({ message: game.describe(id) }); $('#panel-title').textContent = item.name; $('#panel-content').innerHTML = `${image(id, item.name)}<p>${game.describe(id)}</p>`; lastFocus = button; $('#investigation').showModal(); });
    $('#inventory').append(button);
  }
}

function openPanel(id) {
  const result = game.open(id);
  say(result);
  if (!result.ok) return;
  if (!$('#investigation').open) lastFocus = document.activeElement;
  const spot = castleContent.views.flatMap(view => view.hotspots).find(spot => spot.id === id);
  $('#panel-title').textContent = spot.label;
  drawPanel(id);
  if (!$('#investigation').open) $('#investigation').showModal();
}

const actionButton = (id, text, className = '') => `<button data-action="${id}" class="${className}">${text}</button>`;
function drawPanel(id) {
  const content = $('#panel-content');
  if (id === 'book') {
    content.innerHTML = `${image('bookCover', '魔法書封面，右下角以金色燙金顯示 1976，沒有日月圖騰')}<div class="actions">${actionButton('read-book', '翻開魔法書')}</div>`;
  } else if (id === 'trash') {
    content.innerHTML = `${image('trash', '黃銅垃圾桶內的哥德式密碼箱')}<div class="actions">${actionButton('open-box', '調查桶內密碼箱')}</div>`;
  } else if (id === 'box') {
    if (game.state.flags.box_open) {
      content.innerHTML = `${image('lens', '箱內的黃銅魔法透鏡')}<div class="actions">${actionButton('take-lens', game.state.flags.lens_taken ? '透鏡已取走' : '取得魔法透鏡')}</div>`;
      if (game.state.flags.lens_taken) content.innerHTML = '<div class="empty-box">密碼箱已開啟，透鏡已取走。</div>';
    } else content.innerHTML = `<form id="code-form"><div class="art lockbox-art"><img src="${src('lockbox')}" alt="哥德式密碼箱"><div class="code-mask"></div><label class="code-label" for="code">四位密碼</label><input id="code" name="code" class="code-input" type="text" inputmode="numeric" maxlength="8" autocomplete="off" aria-label="四位密碼" placeholder="○ ○ ○ ○"><button class="box-unlock" type="submit">開鎖</button></div></form>`;
  } else if (id === 'painting') {
    const enabled = game.state.flags.lens_active;
    content.innerHTML = `<div class="art painting-art ${enabled ? 'lens-active' : ''}"><img src="${src(enabled ? 'paintingLens' : 'painting')}" alt="《深夜觀星者》${enabled ? '透鏡視角' : '一般視角'}">${game.paintingClues.map((clue,i) => `<figure class="tracing tracing-${i}"><figcaption>${clue.region}</figcaption><canvas width="260" height="160" data-symbol="${clue.symbol}" role="img" aria-label="${clue.region}的星象連線"></canvas></figure>`).join('')}</div><div class="actions">${actionButton('toggle-lens', enabled ? '切回一般視角' : '使用魔法透鏡')}${actionButton('show-chart', '查看星象對照圖', 'quiet')}${actionButton('show-stars', '操作星座機關', 'quiet')}</div>${enabled ? '<details class="text-clues"><summary>以文字查看透鏡線索</summary><p>夜空：獅子座 ♌；長袍：巨蟹座 ♋；手稿：天蠍座 ♏。</p></details>' : '<p class="caption">一般視角 · 仔細觀察油畫，或使用道具調查。</p>'}`;
  } else if (id === 'chart') {
    content.innerHTML = `<div class="art chart-art"><img src="${src('chart')}" alt="十二宮格星象對照圖外框"><div class="chart-grid">${constellations.map(c => `<figure><canvas width="260" height="150" data-symbol="${c.symbol}" role="img" aria-label="${c.name}連線圖"></canvas><figcaption>${c.name} <b>${c.symbol}</b></figcaption></figure>`).join('')}</div></div><p class="caption">將油畫中的連線，與對照圖內的形狀相比。</p><div class="actions">${actionButton('show-painting', '返回油畫', 'quiet')}${actionButton('show-stars', '操作星座機關')}</div>`;
  } else {
    const key = { painting: 'painting', chart: 'chart', stars: 'stars', door: 'door' }[id];
    content.innerHTML = image(key, castleContent.views[0].hotspots.find(s => s.id === id).label);
  }
  for (const canvas of content.querySelectorAll('canvas[data-symbol]')) drawGraph(canvas, constellations.find(c => c.symbol === canvas.dataset.symbol).graph);
}

$('#panel-content').addEventListener('click', event => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'read-book') {
    $('#panel-content').innerHTML = `<div class="art book-pages"><img src="${src('bookOpen')}" alt="魔法書展開的羊皮紙內頁"><div class="writing poem"><h3>魔法師的筆記</h3>${poem.map(line => `<p><strong>${line[0]}</strong>${line.slice(1)}</p>`).join('')}</div><div class="writing hint"><h3>留給學徒</h3><p>${directionHint}</p><p>封面右下角<br><b>1976</b></p></div></div><div class="actions">${actionButton('book-cover', '查看封面')}</div>`;
    $('#panel-message').textContent = '筆記可以隨時回來重讀。';
  }
  if (action === 'book-cover') drawPanel('book');
  if (action === 'open-box') openPanel('box');
  if (action === 'take-lens') { say(game.act('take_lens')); render(); drawPanel('box'); }
  if (action === 'toggle-lens') { say(game.toggleLens()); drawPanel('painting'); }
  if (action === 'show-chart') openPanel('chart');
  if (action === 'show-painting') openPanel('painting');
  if (action === 'show-stars') openPanel('stars');
});
$('#panel-content').addEventListener('submit', event => {
  if (event.target.id !== 'code-form') return;
  event.preventDefault();
  const result = game.act('solve_box', $('#code').value);
  say(result);
  if (result.ok) { render(); drawPanel('box'); }
});

function closePanel() {
  $('#investigation').close();
  game.close();
  lastFocus?.focus();
}

function restart() {
  $('#restart-confirm').close();
  $('#investigation').close();
  game.restart();
  render();
  $('#intro').classList.remove('leaving');
  $('#intro').showModal();
  say({ message: '你是魔法師的學徒，一場失控的實驗將你困在書房。' });
}

try {
  game = createGame();
  document.title = castleContent.room.title;
  $('.letter').style.backgroundImage = `url("${src('parchment')}")`;
  for (const text of letter) { const p = document.createElement('p'); p.textContent = text; $('#letter-text').append(p); }
  for (const spot of castleContent.views[0].hotspots) {
    const button = document.createElement('button');
    button.className = `hotspot ${spot.id}`;
    button.setAttribute('aria-label', `調查${spot.label}`);
    const [x,y,w,h] = spot.rect;
    Object.assign(button.style, { left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` });
    const label = document.createElement('span'); label.textContent = spot.label; button.append(label);
    button.addEventListener('click', () => openPanel(spot.id));
    $('#hotspots').append(button);
  }
  $('#start').addEventListener('click', () => {
    $('#start').disabled = true;
    $('#intro').classList.add('leaving');
    setTimeout(() => { $('#intro').close(); $('#start').disabled = false; say(game.start()); render(); $('.hotspot').focus(); }, 250);
  });
  $('#intro').addEventListener('cancel', event => event.preventDefault());
  $('#close').addEventListener('click', closePanel);
  $('#investigation').addEventListener('cancel', event => { event.preventDefault(); closePanel(); });
  $('#restart').addEventListener('click', () => $('#restart-confirm').showModal());
  $('#play-again').addEventListener('click', restart);
  $('#confirm-restart').addEventListener('click', restart);
  $('#cancel-restart').addEventListener('click', () => $('#restart-confirm').close());
  render();
  $('#intro').showModal();
} catch (error) {
  $('#message').textContent = '遊戲內容載入失敗，請重新載入或檢查遊戲檔案。';
  console.error(error);
}
