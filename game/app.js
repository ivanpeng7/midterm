import { castleContent, assets, letter } from './castle-content.js';
import { createGame } from './engine.js';

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
}

function openPanel(id) {
  const result = game.open(id);
  say(result);
  if (!result.ok) return;
  lastFocus = document.activeElement;
  const spot = castleContent.views[0].hotspots.find(spot => spot.id === id);
  $('#panel-title').textContent = spot.label;
  const key = { book: 'bookCover', trash: 'trash', painting: 'painting', chart: 'chart', stars: 'stars', door: 'door' }[id];
  $('#panel-content').innerHTML = image(key, spot.label);
  $('#investigation').showModal();
}

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
