// 自動產生：請修改原始模組，再執行 node game/build-browser.js。
(() => {
'use strict';
// 來源：constellations.js
// 遊戲用星象示意圖。油畫與對照圖共用資料，位置不另加占星象徵規則。
const graph = (points, edges = points.slice(1).map((_, i) => [i, i + 1])) => ({ points, edges });
const constellations = [
  { name: '牡羊座', symbol: '♈', graph: graph([[15,65],[40,42],[72,35],[85,47]]) },
  { name: '金牛座', symbol: '♉', graph: graph([[10,20],[34,42],[51,62],[72,40],[90,15],[45,82],[51,62]], [[0,1],[1,2],[2,3],[3,4],[2,5]]) },
  { name: '雙子座', symbol: '♊', graph: graph([[28,15],[22,48],[15,85],[72,15],[78,48],[85,85]], [[0,1],[1,2],[3,4],[4,5],[0,3],[1,4]]) },
  { name: '巨蟹座', symbol: '♋', graph: graph([[50,12],[48,42],[32,64],[18,88],[48,42],[73,66],[88,80]], [[0,1],[1,2],[2,3],[1,5],[5,6]]) },
  { name: '獅子座', symbol: '♌', graph: graph([[12,76],[33,46],[65,39],[76,17],[89,29],[83,48],[76,64],[75,82],[37,74]], [[0,1],[1,2],[2,3],[3,4],[4,5],[2,6],[6,7],[7,8],[8,0]]) },
  { name: '處女座', symbol: '♍', graph: graph([[17,16],[35,32],[55,43],[80,24],[55,43],[51,67],[76,84],[27,84]], [[0,1],[1,2],[2,3],[2,5],[5,6],[5,7]]) },
  { name: '天秤座', symbol: '♎', graph: graph([[18,37],[52,15],[83,38],[68,82],[30,80]], [[0,1],[1,2],[2,3],[3,4],[4,0],[0,2]]) },
  { name: '天蠍座', symbol: '♏', graph: graph([[86,12],[76,26],[64,32],[53,48],[44,69],[32,83],[16,80],[10,67],[18,58]]) },
  { name: '射手座', symbol: '♐', graph: graph([[14,64],[35,43],[66,44],[79,68],[58,82],[35,43],[44,17],[62,28]], [[0,1],[1,2],[2,3],[3,4],[4,1],[1,6],[6,7],[7,2]]) },
  { name: '摩羯座', symbol: '♑', graph: graph([[12,25],[30,72],[67,88],[89,35],[50,43]], [[0,1],[1,2],[2,3],[3,4],[4,0]]) },
  { name: '水瓶座', symbol: '♒', graph: graph([[10,28],[30,43],[49,25],[68,44],[89,25],[68,44],[56,68],[35,86]], [[0,1],[1,2],[2,3],[3,4],[3,6],[6,7]]) },
  { name: '雙魚座', symbol: '♓', graph: graph([[8,26],[22,13],[36,29],[22,41],[8,26],[54,57],[73,84],[91,70],[77,54]], [[0,1],[1,2],[2,3],[3,0],[3,5],[5,6],[6,7],[7,8],[8,5]]) }
];

function drawGraph(canvas, data) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const point = index => { const [x,y] = data.points[index]; return [w * (.08 + x * .0084), h * (.08 + y * .0084)]; };
  ctx.strokeStyle = '#a3f4ff'; ctx.lineWidth = 2.4; ctx.shadowColor = '#32d2ee'; ctx.shadowBlur = 9;
  for (const [from,to] of data.edges) { ctx.beginPath(); ctx.moveTo(...point(from)); ctx.lineTo(...point(to)); ctx.stroke(); }
  ctx.fillStyle = '#efffff';
  data.points.forEach((_, index) => { ctx.beginPath(); ctx.arc(...point(index), 3.4, 0, Math.PI * 2); ctx.fill(); });
}

// 來源：castle-content.js
// 正式古堡內容；game-content.js 保留作為第一版格式的教學範例。
const assets = {
  study: 'asset/bg_study.png主場景底圖.png',
  ending: 'asset/bg_study_unlocked.png通關結局大門開啟底圖.png',
  parchment: 'asset/parchment_bg.png羊皮紙.png',
  bookCover: 'asset/magic_book_closed.png魔法書封面.png',
  bookOpen: 'asset/modal_magic_book_open.png魔法書展開.png',
  trash: 'asset/trash_can_detail.png垃圾桶.png',
  lockbox: 'asset/modal_lockbox.png密碼箱.png',
  lens: 'asset/icon_lens.png黃銅魔法透鏡.png',
  painting: 'asset/painting_stargazer_normal.png油畫《深夜觀星者》一般視角特寫.png',
  paintingLens: 'asset/painting_stargazer_lens.png油畫透鏡顯影視角.png',
  chart: 'asset/modal_constellation_chart.png十二星座星象對照圖彈窗.png',
  stars: 'asset/modal_constellation_lock.png星座符號機關介面.png',
  compartment: 'asset/painting_secret_compartment.png油畫向右滑開暗格.png',
  crystalDim: 'asset/icon_crystal_dim.png日月雙色水晶_-_黯淡狀態.png',
  crystal: 'asset/icon_crystal_glowing.png日月雙色水晶_-_發光狀態.png',
  door: 'asset/modal_door_mechanism.png古堡大門黃銅日月機關.png'
};

const letter = [
  '親愛的學徒：',
  '實驗似乎發生了意料之外的變化，書房的大門已被結界封鎖。',
  '我在書房中留下了解開機關的線索。仔細觀察周遭的物品，善用你所學過的知識，相信你一定能找到離開的方法。',
  '切記，真正的答案往往藏在最不起眼的地方。'
];

const poem = ['樂音迴響古堡間，', '色彩斑斕幻影連，', '桶中暗藏玄機在，', '內尋方知鎖鎖牽。'];
const directionHint = '日守天頂，月循右方，雙曜歸位，結界自解。';

const objects = [
  ['book', '魔法書', [43, 48, 15, 12], `封面右下角：1976。\n${poem.join('\n')}\n${directionHint}`],
  ['trash', '垃圾桶', [27, 72, 8, 17], '黃銅垃圾桶裡藏著一只金屬密碼箱。'],
  ['painting', '深夜觀星者', [41, 4, 18, 40], '《深夜觀星者》描繪一位手持手稿、仰望夜空的魔法師。'],
  ['chart', '星象對照圖', [62, 17, 11, 20], '十二星座星象對照圖，可用來比對連線與星座符號。'],
  ['stars', '星座機關', [43, 44, 14, 4], '油畫下有三個星座符號方框。不限排列順序。'],
  ['door', '結界大門', [80, 8, 17, 86], '藍紫色結界封住了大門，中央機關有一個水晶插槽。']
];

const castleContent = {
  schemaVersion: 1,
  room: { id: 'castle_study', title: '禁忌實驗室：古堡逃脫', startViewId: 'study', description: '你是魔法師的學徒。實驗失控，讓你受困於古堡書房。' },
  views: [
    { id: 'study', title: '魔法師書房', hotspots: objects.map(([id, label, rect]) => ({ id, label, rect, interactionId: `inspect_${id}` })) },
    { id: 'details', title: '物件調查', hotspots: [
      { id: 'box', label: '四位密碼箱', rect: [35, 35, 30, 30], interactionId: 'solve_box' },
      { id: 'lens_pickup', label: '魔法透鏡', rect: [10, 10, 20, 20], interactionId: 'take_lens' },
      { id: 'symbol_lock', label: '三格星座機關', rect: [24, 40, 53, 29], interactionId: 'solve_stars' },
      { id: 'crystal_pickup', label: '日月雙色水晶', rect: [37, 37, 16, 30], interactionId: 'take_crystal' },
      { id: 'crystal_slot', label: '水晶插槽', rect: [44, 40, 12, 25], interactionId: 'insert_crystal' },
      { id: 'door_lock', label: '日月方向機關', rect: [22, 20, 57, 60], interactionId: 'solve_door' }
    ] }
  ],
  items: [
    { id: 'lens', name: '魔法透鏡', description: '黃銅材質的單眼鏡片，長度約 12 公分。能顯現一般視角看不到的連線。', consumable: false },
    { id: 'crystal', name: '日月雙色水晶', description: '左半部為金色、右半部為銀色的水晶，可放入大門中央的插槽。', consumable: true }
  ],
  clues: objects.map(([id,,, text]) => ({ id: `clue_${id}`, hotspotId: id, text })),
  puzzles: [{
    id: 'box_code', clueIds: ['clue_book', 'clue_trash'], targetHotspotId: 'box', answer: '1976', solvedFlag: 'box_open',
    solution: '藏頭詩「樂色桶內」以諧音指向垃圾桶內；魔法書封面右下角的 1976 可直接開箱，箱內可取魔法透鏡。',
    onSolved: [{ type: 'setFlag', flag: 'box_open', value: true }]
  }, {
    id: 'star_symbols', answerType: 'symbols', clueIds: ['clue_painting', 'clue_chart'], targetHotspotId: 'symbol_lock', answer: '♌♋♏', solvedFlag: 'painting_open',
    solution: '用透鏡查看油畫；將夜空、長袍、手稿的連線與十二宮格比對，分別為獅子、巨蟹、天蠍；三符號各一次，不限順序。解開後油畫右移，暗格水晶自動轉亮並可拾取。',
    onSolved: [{ type: 'setFlag', flag: 'painting_open', value: true }]
  }, {
    id: 'sun_moon', answerType: 'directions', clueIds: ['clue_book', 'clue_door'], targetHotspotId: 'door_lock', answer: 'up,right', solvedFlag: 'escaped',
    solution: '將日月雙色水晶放入大門插槽；依魔法書「日守天頂，月循右方」將太陽朝上、月亮朝右，確認後解除結界並逃脫。',
    onSolved: [{ type: 'setFlag', flag: 'escaped', value: true }]
  }],
  interactions: [
    ...objects.map(([id,,, text]) => ({ id: `inspect_${id}`, kind: 'inspect', clueId: `clue_${id}`, feedback: { success: text } })),
    { id: 'solve_box', kind: 'enterCode', puzzleId: 'box_code', feedback: { success: '密碼箱打開了。箱內有一片黃銅透鏡。', failure: '密碼不對，請輸入四位半形數字。可以重新嘗試。', repeated: '密碼箱已經打開。' } },
    { id: 'take_lens', kind: 'take', itemId: 'lens', onceFlag: 'lens_taken', requiresFlags: ['box_open'], feedback: { success: '你取得了魔法透鏡，可在道具欄查看。', failure: '先解開密碼箱，才能取得透鏡。', repeated: '透鏡已經取走了。' } },
    { id: 'solve_stars', kind: 'enterSymbols', puzzleId: 'star_symbols', requiresFlags: ['lens_taken', 'lens_observed'], feedback: { success: '喀嚓，油畫下的機關解開了。', failure: '機關沒有反應。請用透鏡調查油畫，再比對三個不同的星座符號。', repeated: '油畫暗格已經打開。' } },
    { id: 'take_crystal', kind: 'take', itemId: 'crystal', onceFlag: 'crystal_taken', requiresFlags: ['painting_open'], feedback: { success: '你取得了日月雙色水晶。', failure: '需要先解開油畫機關。', repeated: '暗格的水晶已經取走了。' } },
    { id: 'insert_crystal', kind: 'useItem', itemId: 'crystal', onceFlag: 'crystal_inserted', requiresFlags: ['crystal_taken'], onSuccess: [{ type: 'removeItem', itemId: 'crystal' }, { type: 'setFlag', flag: 'crystal_inserted', value: true }], feedback: { success: '水晶已嵌入插槽，日月方向控制啟動。', failure: '需要先取得日月雙色水晶，並選擇這顆水晶放入。', repeated: '水晶已經嵌入插槽，無須再次放入。' } },
    { id: 'solve_door', kind: 'enterDirections', puzzleId: 'sun_moon', requiresFlags: ['crystal_inserted'], feedback: { success: '結界散去，大門開啟。你成功逃脫！', failure: '結界仍在。請先放入水晶，再依魔法書調整日月方向。', repeated: '大門已經開啟，你已成功逃脫。' } }
  ],
  initialState: { viewId: 'study', inventory: [], flags: { started: false, escaped: false, box_open: false, lens_taken: false, lens_active: false, lens_observed: false, painting_open: false, crystal_taken: false, crystal_inserted: false, sun_up: false, moon_right: false } }
};

// 來源：validate-content.js
const idPattern = /^[a-z][a-z0-9_]*$/;
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isText = value => typeof value === 'string' && value.trim().length > 0;

// 回傳所有可辨識的格式錯誤，讓編輯內容的人能一次修正。
function validateGameContent(content) {
  const errors = [];
  const fail = (path, reason) => errors.push(`${path}：${reason}`);
  const shape = (value, path, required, optional = []) => {
    if (!isObject(value)) { fail(path, '必須是物件'); return false; }
    for (const key of required) if (!(key in value)) fail(`${path}.${key}`, '缺少必要欄位');
    for (const key of Object.keys(value)) {
      if (![...required, ...optional].includes(key)) fail(`${path}.${key}`, '不支援的欄位');
    }
    return true;
  };
  const text = (value, path) => { if (!isText(value)) fail(path, '必須是非空文字'); };
  const id = (value, path) => {
    if (!idPattern.test(value ?? '')) fail(path, '識別碼格式錯誤');
  };
  const array = (value, path, min = 0) => {
    if (!Array.isArray(value)) { fail(path, '必須是陣列'); return []; }
    if (value.length < min) fail(path, `至少需要 ${min} 筆`);
    return value;
  };
  const declared = new Map();
  const collect = (value, path, type) => {
    id(value, path);
    if (typeof value !== 'string') return;
    if (declared.has(value)) fail(path, `識別碼與 ${declared.get(value).path} 重複`);
    else declared.set(value, { path, type });
  };
  const reference = (value, path, type) => {
    if (!isText(value)) { fail(path, '引用必須是非空文字'); return; }
    if (declared.get(value)?.type !== type) fail(path, `找不到${type} ${value}`);
  };

  if (!shape(content, 'content', ['schemaVersion', 'room', 'views', 'items', 'clues', 'puzzles', 'interactions', 'initialState'])) return errors;
  if (content.schemaVersion !== 1) fail('schemaVersion', '只支援版本 1');
  const room = content.room;
  if (shape(room, 'room', ['id', 'title', 'startViewId'], ['description'])) {
    collect(room.id, 'room.id', 'room');
    text(room.title, 'room.title');
    text(room.startViewId, 'room.startViewId');
    if ('description' in room) text(room.description, 'room.description');
  }

  const views = array(content.views, 'views', 1);
  for (const [i, view] of views.entries()) {
    const path = `views[${i}]`;
    if (!shape(view, path, ['id', 'title', 'hotspots'], ['description'])) continue;
    collect(view.id, `${path}.id`, '畫面');
    text(view.title, `${path}.title`);
    if ('description' in view) text(view.description, `${path}.description`);
    for (const [j, spot] of array(view.hotspots, `${path}.hotspots`).entries()) {
      const p = `${path}.hotspots[${j}]`;
      if (!shape(spot, p, ['id', 'label', 'rect', 'interactionId'])) continue;
      collect(spot.id, `${p}.id`, '可點區域');
      text(spot.label, `${p}.label`);
      text(spot.interactionId, `${p}.interactionId`);
      const rect = spot.rect;
      if (!Array.isArray(rect) || rect.length !== 4 || !rect.every(Number.isFinite) ||
          rect[0] < 0 || rect[1] < 0 || rect[2] <= 0 || rect[3] <= 0 ||
          rect[0] + rect[2] > 100 || rect[1] + rect[3] > 100) {
        fail(`${p}.rect`, '座標或尺寸超出 0～100 的場景範圍');
      }
    }
  }

  const items = array(content.items, 'items');
  for (const [i, item] of items.entries()) {
    const p = `items[${i}]`;
    if (!shape(item, p, ['id', 'name', 'description', 'consumable'])) continue;
    collect(item.id, `${p}.id`, '道具');
    text(item.name, `${p}.name`);
    text(item.description, `${p}.description`);
    if (typeof item.consumable !== 'boolean') fail(`${p}.consumable`, '必須是布林值');
  }
  const clues = array(content.clues, 'clues');
  for (const [i, clue] of clues.entries()) {
    const p = `clues[${i}]`;
    if (!shape(clue, p, ['id', 'hotspotId', 'text'])) continue;
    collect(clue.id, `${p}.id`, '線索');
    text(clue.hotspotId, `${p}.hotspotId`);
    text(clue.text, `${p}.text`);
  }

  const state = content.initialState;
  let flags = {};
  if (shape(state, 'initialState', ['viewId', 'inventory', 'flags'])) {
    text(state.viewId, 'initialState.viewId');
    array(state.inventory, 'initialState.inventory');
    if (Array.isArray(state.inventory) && state.inventory.length) fail('initialState.inventory', '新遊戲道具欄必須為空');
    if (isObject(state.flags)) {
      flags = state.flags;
      for (const [name, value] of Object.entries(flags)) {
        id(name, `initialState.flags.${name}`);
        if (typeof value !== 'boolean') fail(`initialState.flags.${name}`, '必須是布林值');
      }
      if (flags.escaped !== false) fail('initialState.flags.escaped', '新遊戲時必須宣告為 false');
    } else fail('initialState.flags', '必須是物件');
  }
  const flag = (value, path) => {
    if (!Object.hasOwn(flags, value)) fail(path, `找不到旗標 ${value}`);
    else if (flags[value] !== false) fail(path, '完成旗標初始值必須為 false');
  };
  const effects = (value, path) => {
    for (const [i, effect] of array(value, path, 1).entries()) {
      const p = `${path}[${i}]`;
      if (!isObject(effect)) { fail(p, '必須是效果物件'); continue; }
      if (effect.type === 'setFlag') {
        if (!shape(effect, p, ['type', 'flag', 'value'])) continue;
        if (!Object.hasOwn(flags, effect.flag)) fail(`${p}.flag`, `找不到旗標 ${effect.flag}`);
        if (typeof effect.value !== 'boolean') fail(`${p}.value`, '必須是布林值');
      } else if (effect.type === 'addItem' || effect.type === 'removeItem') {
        if (!shape(effect, p, ['type', 'itemId'])) continue;
        reference(effect.itemId, `${p}.itemId`, '道具');
        if (effect.type === 'removeItem' && items.find(item => item?.id === effect.itemId)?.consumable !== true) {
          fail(`${p}.itemId`, '只能移除可消耗的道具');
        }
      } else fail(`${p}.type`, '不支援的效果種類');
    }
  };
  const hasFlagEffect = (effectsList, name) => Array.isArray(effectsList) &&
    effectsList.some(effect => effect?.type === 'setFlag' && effect.flag === name && effect.value === true);

  const puzzles = array(content.puzzles, 'puzzles');
  for (const [i, puzzle] of puzzles.entries()) {
    const p = `puzzles[${i}]`;
    if (!shape(puzzle, p, ['id', 'clueIds', 'targetHotspotId', 'answer', 'solution', 'solvedFlag', 'onSolved'], ['answerType'])) continue;
    collect(puzzle.id, `${p}.id`, '謎題');
    for (const [j, clueId] of array(puzzle.clueIds, `${p}.clueIds`, 1).entries()) reference(clueId, `${p}.clueIds[${j}]`, '線索');
    reference(puzzle.targetHotspotId, `${p}.targetHotspotId`, '可點區域');
    if (puzzle.answerType === 'symbols') {
      const symbols = typeof puzzle.answer === 'string' ? [...puzzle.answer] : [];
      if (symbols.length !== 3 || new Set(symbols).size !== 3 || !symbols.every(symbol => '♈♉♊♋♌♍♎♏♐♑♒♓'.includes(symbol))) fail(`${p}.answer`, '必須是三個不同的星座符號');
    } else if (puzzle.answerType === 'directions') {
      if (typeof puzzle.answer !== 'string' || !/^(up|down),(left|right)$/.test(puzzle.answer)) fail(`${p}.answer`, '必須是太陽上下與月亮左右的方向組合');
    } else {
      if ('answerType' in puzzle && puzzle.answerType !== 'code') fail(`${p}.answerType`, '不支援的答案種類');
      if (typeof puzzle.answer !== 'string' || !/^\d+$/.test(puzzle.answer)) fail(`${p}.answer`, '必須是非空半形數字字串');
    }
    text(puzzle.solution, `${p}.solution`);
    flag(puzzle.solvedFlag, `${p}.solvedFlag`);
    effects(puzzle.onSolved, `${p}.onSolved`);
    if (!hasFlagEffect(puzzle.onSolved, puzzle.solvedFlag)) fail(`${p}.onSolved`, '必須將完成旗標設為 true');
  }

  const kinds = {
    inspect: ['clueId'], take: ['itemId', 'onceFlag'], enterCode: ['puzzleId'], enterSymbols: ['puzzleId'], enterDirections: ['puzzleId'],
    useItem: ['itemId', 'onceFlag', 'onSuccess'], switchView: ['toViewId']
  };
  const feedbackKeys = {
    inspect: ['success'], take: ['success', 'repeated'], enterCode: ['success', 'failure', 'repeated'],
    useItem: ['success', 'failure', 'repeated'], switchView: ['success'], enterSymbols: ['success', 'failure', 'repeated'], enterDirections: ['success', 'failure', 'repeated']
  };
  const interactions = array(content.interactions, 'interactions');
  for (const [i, interaction] of interactions.entries()) {
    const p = `interactions[${i}]`;
    if (!isObject(interaction)) { fail(p, '必須是物件'); continue; }
    const kind = interaction.kind;
    if (!Object.hasOwn(kinds, kind)) { fail(`${p}.kind`, '不支援的互動種類'); continue; }
    if (!shape(interaction, p, ['id', 'kind', 'feedback', ...kinds[kind]], ['requiresFlags'])) continue;
    collect(interaction.id, `${p}.id`, '互動');
    if ('requiresFlags' in interaction) {
      for (const [j, name] of array(interaction.requiresFlags, `${p}.requiresFlags`, 1).entries()) flag(name, `${p}.requiresFlags[${j}]`);
      text(interaction.feedback?.failure, `${p}.feedback.failure`);
    }
    if (shape(interaction.feedback, `${p}.feedback`, feedbackKeys[kind], 'requiresFlags' in interaction ? ['failure'] : [])) {
      for (const key of feedbackKeys[kind]) text(interaction.feedback[key], `${p}.feedback.${key}`);
    }
    const spot = views.flatMap(view => Array.isArray(view?.hotspots) ? view.hotspots : [])
      .find(hotspot => hotspot?.interactionId === interaction.id);
    if (kind === 'inspect') {
      reference(interaction.clueId, `${p}.clueId`, '線索');
      if (clues.find(clue => clue?.id === interaction.clueId)?.hotspotId !== spot?.id) fail(`${p}.clueId`, '線索必須位於觸發區域');
    }
    if (kind === 'take' || kind === 'useItem') {
      reference(interaction.itemId, `${p}.itemId`, '道具');
      flag(interaction.onceFlag, `${p}.onceFlag`);
    }
    if (kind === 'enterCode' || kind === 'enterSymbols' || kind === 'enterDirections') {
      reference(interaction.puzzleId, `${p}.puzzleId`, '謎題');
      if (puzzles.find(puzzle => puzzle?.id === interaction.puzzleId)?.targetHotspotId !== spot?.id) fail(`${p}.puzzleId`, '謎題目標必須是觸發區域');
      const type = puzzles.find(puzzle => puzzle?.id === interaction.puzzleId)?.answerType ?? 'code';
      if ({ enterCode: 'code', enterSymbols: 'symbols', enterDirections: 'directions' }[kind] !== type) fail(`${p}.puzzleId`, '互動與答案種類不一致');
    }
    if (kind === 'useItem') {
      effects(interaction.onSuccess, `${p}.onSuccess`);
      if (!hasFlagEffect(interaction.onSuccess, interaction.onceFlag)) fail(`${p}.onSuccess`, '必須將完成旗標設為 true');
    }
    if (kind === 'switchView') reference(interaction.toViewId, `${p}.toViewId`, '畫面');
  }

  if (room) reference(room.startViewId, 'room.startViewId', '畫面');
  if (state && room && state.viewId !== room.startViewId) fail('initialState.viewId', '必須等於起始畫面');
  for (const [i, view] of views.entries()) {
    for (const [j, spot] of (Array.isArray(view?.hotspots) ? view.hotspots : []).entries()) {
      reference(spot?.interactionId, `views[${i}].hotspots[${j}].interactionId`, '互動');
    }
  }
  for (const [i, clue] of clues.entries()) reference(clue?.hotspotId, `clues[${i}].hotspotId`, '可點區域');
  const completed = new Set([...puzzles.map(p => p?.solvedFlag), ...interactions.map(a => a?.onceFlag)].filter(Boolean));
  for (const [i, puzzle] of puzzles.entries()) {
    for (const [j, effect] of (Array.isArray(puzzle?.onSolved) ? puzzle.onSolved : []).entries()) {
      if (effect?.type === 'setFlag' && completed.has(effect.flag) && effect.value === false) fail(`puzzles[${i}].onSolved[${j}].value`, '不得重設完成旗標');
    }
  }
  for (const [i, action] of interactions.entries()) {
    for (const [j, effect] of (Array.isArray(action?.onSuccess) ? action.onSuccess : []).entries()) {
      if (effect?.type === 'setFlag' && completed.has(effect.flag) && effect.value === false) fail(`interactions[${i}].onSuccess[${j}].value`, '不得重設完成旗標');
    }
  }
  return errors;
}

function loadGameContent(content) {
  const errors = validateGameContent(content);
  if (errors.length) throw new Error(`遊戲內容載入失敗\n${errors.join('\n')}`);
  return content;
}

// 來源：engine.js

// 只對副本套用；任一效果不合法便整組失敗，原狀態保持完整。
function applyEffects(state, effects, content) {
  const next = structuredClone(state);
  if (!Array.isArray(effects)) throw new Error('效果必須是陣列');
  for (const effect of effects) {
    if (effect?.type === 'setFlag') {
      if (!Object.hasOwn(next.flags, effect.flag) || typeof effect.value !== 'boolean' || (next.flags[effect.flag] && !effect.value)) throw new Error('旗標效果無效');
      next.flags[effect.flag] = effect.value;
    } else if (effect?.type === 'addItem' || effect?.type === 'removeItem') {
      const item = content.items.find(item => item.id === effect.itemId);
      if (!item) throw new Error('找不到效果道具');
      if (effect.type === 'addItem') {
        if (!next.inventory.includes(item.id)) next.inventory.push(item.id);
      } else {
        if (!item.consumable || !next.inventory.includes(item.id)) throw new Error('不能移除這個道具');
        next.inventory = next.inventory.filter(id => id !== item.id);
      }
    } else throw new Error('不支援的效果');
  }
  return next;
}

// 遊戲資料與畫面分離；讀取 state 時回傳副本，外部不能偷偷修改進度。
function createGame(content = castleContent) {
  loadGameContent(content);
  let state = structuredClone(content.initialState);
  let panel = null;
  const reply = (ok, message) => ({ ok, message });
  return {
    get state() { return structuredClone(state); },
    get panel() { return panel; },
    get paintingClues() {
      if (!state.inventory.includes('lens') || !state.flags.lens_active) return [];
      return [['夜空','♌'],['長袍','♋'],['手稿','♏']].map(([region,symbol]) => ({ region, symbol, graph: structuredClone(constellations.find(c => c.symbol === symbol).graph) }));
    },
    toggleLens() {
      if (!state.flags.started || state.flags.escaped || !state.inventory.includes('lens')) return reply(false, '需要先取得魔法透鏡。');
      state.flags.lens_active = !state.flags.lens_active;
      if (panel === 'painting' && state.flags.lens_active) state.flags.lens_observed = true;
      return reply(true, state.flags.lens_active ? '已啟用透鏡視角。仔細比對三處連線與星象對照圖。' : '已切回一般視角。');
    },
    setDirection(control, direction) {
      if (!state.flags.started || state.flags.escaped || !state.flags.crystal_inserted) return reply(false, '先將日月雙色水晶放入插槽，才能啟動方向控制。');
      const choices = { sun: ['up','down'], moon: ['left','right'] };
      if (!choices[control]?.includes(direction)) return reply(false, '太陽只能上下切換，月亮只能左右切換。');
      state.flags[control === 'sun' ? 'sun_up' : 'moon_right'] = direction === 'up' || direction === 'right';
      return reply(true, `${control === 'sun' ? '太陽' : '月亮'}現在朝${{ up: '上', down: '下', left: '左', right: '右' }[direction]}。`);
    },
    describe(id) { return content.items.find(item => item.id === id && state.inventory.includes(id))?.description ?? '目前沒有這個道具。'; },
    start() { if (state.flags.started || state.flags.escaped) return reply(false, '這一局已經開始。'); state.flags.started = true; return reply(true, '仔細調查書房，尋找解除結界的方法。'); },
    open(id) {
      if (!state.flags.started || state.flags.escaped) return reply(false, '請先開始新遊戲。');
      const spot = content.views.flatMap(view => view.hotspots).find(spot => spot.id === id);
      const interaction = content.interactions.find(action => action.id === spot?.interactionId);
      if (!interaction) return reply(false, '找不到這個調查物件。');
      panel = id;
      if (id === 'painting' && state.flags.lens_active && state.inventory.includes('lens')) state.flags.lens_observed = true;
      return reply(true, content.clues.find(clue => clue.id === interaction.clueId)?.text ?? `正在調查${spot.label}。`);
    },
    act(id, input) {
      if (!state.flags.started || state.flags.escaped) return reply(false, '本局尚未開始或已經完成。');
      const action = content.interactions.find(action => action.id === id);
      if (!action) return reply(false, '找不到這項操作。');
      const puzzle = content.puzzles.find(puzzle => puzzle.id === action.puzzleId);
      const done = puzzle?.solvedFlag ?? action.onceFlag;
      if (done && state.flags[done]) return reply(false, action.feedback.repeated);
      if (action.requiresFlags?.some(flag => !state.flags[flag])) return reply(false, action.feedback.failure);
      let effects;
      if (action.kind === 'enterCode') {
        if (typeof input !== 'string' || input.trim() !== puzzle.answer) return reply(false, action.feedback.failure);
        effects = puzzle.onSolved;
      } else if (action.kind === 'enterSymbols') {
        const answer = [...puzzle.answer].sort();
        if (!Array.isArray(input) || input.length !== answer.length || !input.every(symbol => typeof symbol === 'string') || [...input].sort().some((symbol,i) => symbol !== answer[i])) return reply(false, action.feedback.failure);
        effects = puzzle.onSolved;
      } else if (action.kind === 'enterDirections') {
        if (`${state.flags.sun_up ? 'up' : 'down'},${state.flags.moon_right ? 'right' : 'left'}` !== puzzle.answer) return reply(false, action.feedback.failure);
        effects = puzzle.onSolved;
      } else if (action.kind === 'take') {
        effects = [{ type: 'addItem', itemId: action.itemId }, { type: 'setFlag', flag: action.onceFlag, value: true }];
      } else if (action.kind === 'useItem') {
        if (input !== action.itemId || !state.inventory.includes(input)) return reply(false, action.feedback.failure);
        effects = action.onSuccess;
      } else if (action.kind === 'switchView') {
        state.viewId = action.toViewId; return reply(true, action.feedback.success);
      } else return reply(false, '請直接調查這個物件。');
      try { state = applyEffects(state, effects, content); }
      catch { return reply(false, '操作未完成，進度已保留。'); }
      return reply(true, action.feedback.success);
    },
    close() { panel = null; },
    restart() { state = structuredClone(content.initialState); panel = null; return reply(true, '新遊戲已開始。'); }
  };
}

// 來源：audio.js
// 使用原始素材；只限制單次音效播放長度，不改動音檔。
const audioTracks = {
  music: { file: 'bgm_mystic_study.wav (1).wav', volume: .2, loop: true },
  fire: { file: 'sfx_fireplace_crackle.wav.wav', volume: .08, loop: true },
  click: { file: 'sfx_click_button.wav.mp3', volume: .25, maxSeconds: .4 },
  paper: { file: 'sfx_paper_flip.wax.wav', volume: .35, maxSeconds: 1.2 },
  dial: { file: 'sfx_lockbox_dial.wav.wav', volume: .35, maxSeconds: .5 },
  boxOpen: { file: 'sfx_lockbox_open.wav.wav', volume: .4, maxSeconds: 2 },
  pickup: { file: 'sfx_item_pickup.wav.wav', volume: .4, maxSeconds: 1 },
  lens: { file: 'sfx_lens_toggle.wav.wav', volume: .35, maxSeconds: 1.4 },
  symbol: { file: 'sfx_constellation_click.wav.flac', volume: .35, maxSeconds: .6 },
  slide: { file: 'sfx_painting_slide.wav.wav', volume: .4, maxSeconds: 1.6 },
  charge: { file: 'sfx_crystal_charge.wav.wav', volume: .4, maxSeconds: 2 },
  insert: { file: 'sfx_crystal_insert.wav.mp3', volume: .45, maxSeconds: 1 },
  toggle: { file: 'sfx_switch_toggle.wav.wav', volume: .35, maxSeconds: .6 },
  error: { file: 'sfx_error_shake.wav.wav', volume: .3, maxSeconds: 1 },
  barrier: { file: 'sfx_barrier_dispel.wav.wav', volume: .45, maxSeconds: 2.7 },
  door: { file: 'sfx_door_open.wav.wav', volume: .4, maxSeconds: 3 }
};

function createGameAudio({ makeAudio = url => new Audio(url), schedule = setTimeout, cancel = clearTimeout } = {}) {
  const players = new Map(), deadlines = new Map(), pending = new Set(), generations = new Map();
  let unlocked = false, roomActive = false, muted = false, visible = true;
  const available = () => unlocked && !muted && visible;
  const later = (fn, delay) => {
    const id = schedule(() => { pending.delete(id); fn(); }, delay);
    pending.add(id); return id;
  };
  const stop = (key, rewind = true) => {
    generations.set(key, (generations.get(key) ?? 0) + 1);
    const id = deadlines.get(key);
    if (id !== undefined) { cancel(id); pending.delete(id); deadlines.delete(key); }
    try { const player = players.get(key); player?.pause(); if (player && rewind) player.currentTime = 0; } catch { /* 音訊狀態不可影響遊戲。 */ }
  };
  const silence = () => {
    for (const id of pending) cancel(id);
    pending.clear(); deadlines.clear();
    for (const key of players.keys()) stop(key, !audioTracks[key].loop);
  };
  const getPlayer = key => {
    if (!players.has(key)) {
      const track = audioTracks[key];
      const player = makeAudio(`../asset/${encodeURIComponent(track.file)}`);
      player.loop = Boolean(track.loop); player.volume = track.volume; player.preload = 'none';
      players.set(key, player);
    }
    return players.get(key);
  };
  const play = key => {
    const track = audioTracks[key];
    if (!available() || !track) return;
    try {
      const player = getPlayer(key);
      if (track.loop && !player.paused) return;
      if (!track.loop) stop(key);
      const generation = generations.get(key);
      // 等到實際開始發聲才計時，避免首次載入較慢時被提早截掉。
      const limit = () => {
        if (!track.loop && generation === generations.get(key) && available() && !player.paused) deadlines.set(key, later(() => stop(key), track.maxSeconds * 1000));
      };
      if (!track.loop) player.addEventListener?.('playing', limit, { once: true });
      const started = player.play();
      if (!player.addEventListener) limit();
      started?.catch?.(() => {});
    } catch { /* 裝置不支援、解碼或播放受限時，原操作仍可完成。 */ }
  };
  const resume = () => { if (roomActive && available()) { play('music'); play('fire'); } };
  const start = () => { unlocked = true; roomActive = true; resume(); };
  const reset = () => { silence(); for (const key of players.keys()) stop(key); unlocked = false; roomActive = false; };
  return {
    get muted() { return muted; },
    start, play, reset,
    setMuted(value) { muted = Boolean(value); if (muted) silence(); else resume(); },
    setVisible(value) { visible = Boolean(value); if (!visible) silence(); else resume(); },
    handle(action, result) {
      if (!result?.ok) { play('error'); return; }
      if (action === 'start') { start(); return; }
      const cues = { solve_box: 'boxOpen', take_lens: 'pickup', take_crystal: 'pickup', 'toggle-lens': 'lens', insert_crystal: 'insert', sun: 'toggle', moon: 'toggle' };
      if (cues[action]) play(cues[action]);
      if (action === 'solve_stars' && available()) { play('slide'); later(() => play('charge'), 300); }
      if (action === 'solve_door') {
        silence(); roomActive = false;
        if (available()) { play('barrier'); later(() => play('door'), 800); }
      }
    }
  };
}

// 來源：app.js

const $ = selector => document.querySelector(selector);
const src = key => `../${assets[key]}`;
const sound = createGameAudio();
const audible = (action, result) => { sound.handle(action, result); return result; };
document.addEventListener('visibilitychange', () => sound.setVisible(!document.hidden));
window.addEventListener('pagehide', () => sound.setVisible(false));
window.addEventListener('pageshow', () => sound.setVisible(!document.hidden));
document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button || button.disabled) return;
  if (button.matches('[data-sound-toggle]')) {
    sound.setMuted(!sound.muted);
    for (const control of document.querySelectorAll('[data-sound-toggle]')) {
      control.textContent = sound.muted ? '聲音：關' : '聲音：開';
      control.setAttribute('aria-pressed', String(sound.muted));
    }
  } else if (button.id !== 'start' && !['read-book','book-cover','cycle-symbol','sun','moon','toggle-lens','insert-crystal','solve-stars','solve-door','take-lens','take-crystal'].includes(button.dataset.action)) sound.play('click');
}, true);
let game;
let lastFocus;
let symbolChoices = [0, 0, 0];
let round = 0;
const say = result => { $('#message').textContent = result.message; $('#panel-message').textContent = result.message; };
const image = (key, alt) => `<div class="art"><img src="${src(key)}" alt="${alt}"></div>`;

// 每張調查圖片使用剩餘的顯示空間，按鈕與文字先保留原本所需高度。
function prepareArtwork() {
  for (const art of $('#panel-content').querySelectorAll('.art')) {
    if (art.parentElement.classList.contains('art-slot')) continue;
    const slot = document.createElement('div');
    slot.className = 'art-slot';
    art.before(slot);
    slot.append(art);
  }
}
new MutationObserver(prepareArtwork).observe($('#panel-content'), { childList: true, subtree: true });

function render() {
  const state = game.state;
  const roomSrc = src(state.flags.escaped ? 'ending' : 'study');
  if ($('#room-image').getAttribute('src') !== roomSrc) $('#room-image').src = roomSrc;
  $('#ending').hidden = !state.flags.escaped;
  $('#hotspots').hidden = state.flags.escaped;
  $('#mobile-objects').hidden = state.flags.escaped;
  $('#inventory').replaceChildren();
  if (!state.inventory.length) $('#inventory').innerHTML = '<p>尚未取得道具</p>';
  for (const id of state.inventory) {
    const item = castleContent.items.find(item => item.id === id);
    const button = document.createElement('button');
    button.className = 'inventory-item quiet';
    button.innerHTML = `<img src="${src(id)}" alt=""><span>查看${item.name}</span>`;
    button.addEventListener('click', () => { say({ message: game.describe(id) }); $('#panel-title').textContent = item.name; $('#panel-content').innerHTML = `${image(id, item.name)}<p>${game.describe(id)}</p><div class="actions">${actionButton(id === 'lens' ? 'show-painting' : 'show-door', id === 'lens' ? '前往油畫調查' : '前往大門插槽')}</div>`; lastFocus = button; $('#investigation').showModal(); });
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
function drawPanel(id, reveal = false) {
  const content = $('#panel-content');
  if (id === 'book') {
    content.innerHTML = `${image('bookCover', '魔法書封面，右下角以金色燙金顯示 1976，沒有日月圖騰')}<div class="actions">${actionButton('read-book', '翻開魔法書')}</div>`;
  } else if (id === 'trash') {
    content.innerHTML = `${image('trash', '黃銅垃圾桶內的哥德式密碼箱')}<div class="actions">${actionButton('open-box', '調查桶內密碼箱')}</div>`;
  } else if (id === 'box') {
    if (game.state.flags.box_open) {
      content.innerHTML = `${image('lens', '箱內的黃銅魔法透鏡')}<div class="actions">${actionButton('take-lens', game.state.flags.lens_taken ? '透鏡已取走' : '取得魔法透鏡')}</div>`;
      if (game.state.flags.lens_taken) content.innerHTML = '<div class="empty-box">密碼箱已開啟，透鏡已取走。</div>';
    } else content.innerHTML = `<form id="code-form"><div class="art lockbox-art"><img src="${src('lockbox')}" alt="哥德式密碼箱"><div class="code-mask" aria-hidden="true"></div><div class="code-entry"><input id="code" name="code" class="code-input" type="text" inputmode="numeric" maxlength="8" autocomplete="off" aria-label="四位密碼" placeholder=" "><div class="code-placeholder" aria-hidden="true"><span></span><span></span><span></span><span></span></div></div><button class="box-unlock" type="submit">開鎖</button></div></form>`;
  } else if (id === 'painting') {
    if (game.state.flags.painting_open) { drawCompartment(reveal); return; }
    const enabled = game.state.flags.lens_active;
    content.innerHTML = `<div class="art painting-art ${enabled ? 'lens-active' : ''}"><img src="${src(enabled ? 'paintingLens' : 'painting')}" alt="《深夜觀星者》${enabled ? '透鏡視角' : '一般視角'}">${game.paintingClues.map((clue,i) => `<figure class="tracing tracing-${i}"><figcaption>${clue.region}</figcaption><canvas width="260" height="160" data-symbol="${clue.symbol}" role="img" aria-label="${clue.region}的星象連線"></canvas></figure>`).join('')}</div><div class="actions">${actionButton('toggle-lens', enabled ? '切回一般視角' : '使用魔法透鏡')}${actionButton('show-chart', '查看星象對照圖', 'quiet')}${actionButton('show-stars', '操作星座機關', 'quiet')}</div>${enabled ? '<details class="text-clues"><summary>以文字查看透鏡線索</summary><p>夜空：獅子座 ♌；長袍：巨蟹座 ♋；手稿：天蠍座 ♏。</p></details>' : '<p class="caption">一般視角 · 仔細觀察油畫，或使用道具調查。</p>'}`;
  } else if (id === 'chart') {
    content.innerHTML = `<div class="art chart-art"><img src="${src('chart')}" alt="十二宮格星象對照圖外框"><div class="chart-grid">${constellations.map(c => `<figure><canvas width="260" height="150" data-symbol="${c.symbol}" role="img" aria-label="${c.name}連線圖"></canvas><figcaption>${c.name} <b>${c.symbol}</b></figcaption></figure>`).join('')}</div></div><p class="caption">將油畫中的連線，與對照圖內的形狀相比。</p><div class="actions">${actionButton('show-painting', '返回油畫', 'quiet')}${actionButton('show-stars', '操作星座機關')}</div>`;
  } else if (id === 'stars') {
    if (game.state.flags.painting_open) { drawCompartment(false); return; }
    content.innerHTML = `<p class="caption">不限排列順序 · 點擊任一方框，循環切換十二種星座符號。</p><div class="art symbols-art"><img src="${src('stars')}" alt="三格星座符號機關">${symbolChoices.map((choice,i) => `<button data-action="cycle-symbol" data-slot="${i}" class="symbol-choice slot-${i}" aria-label="第 ${i+1} 格：${constellations[choice].name} ${constellations[choice].symbol}"><span>${constellations[choice].symbol}</span><small>${constellations[choice].name}</small></button>`).join('')}</div><div class="actions">${actionButton('solve-stars', '確認星座符號')}${actionButton('show-chart', '查看星象對照圖', 'quiet')}${actionButton('show-painting', '返回油畫', 'quiet')}</div>`;
  } else if (id === 'door') {
    const flags = game.state.flags;
    content.innerHTML = `<div class="art door-art"><img src="${src('door')}" alt="大門黃銅日月機關，左太陽、右月亮、中央水晶插槽"><button data-action="sun" class="direction-control sun-control" aria-label="太陽方向：${flags.sun_up ? '上' : '下'}，點擊切換" aria-disabled="${!flags.crystal_inserted}"><span>☀</span><b>${flags.sun_up ? '↑ 上' : '↓ 下'}</b></button><button data-action="insert-crystal" class="door-slot ${flags.crystal_inserted ? 'filled' : ''}" aria-label="${flags.crystal_inserted ? '水晶已嵌入插槽' : '放入日月雙色水晶'}">${flags.crystal_inserted ? `<img class="crystal-sprite" src="${src('crystal')}" alt="左金右銀的水晶已嵌入">` : '<span>水晶<br>插槽</span>'}</button><button data-action="moon" class="direction-control moon-control" aria-label="月亮方向：${flags.moon_right ? '右' : '左'}，點擊切換" aria-disabled="${!flags.crystal_inserted}"><span>☾</span><b>${flags.moon_right ? '→ 右' : '← 左'}</b></button></div><p class="caption">${flags.crystal_inserted ? '水晶已放入 · 點擊太陽切換上下，點擊月亮切換左右。' : '機關尚未啟動 · 需要日月雙色水晶。'}</p><div class="actions">${actionButton('solve-door', '確認方向，解除結界')}${actionButton('show-book', '重看魔法書', 'quiet')}</div>`;
  } else {
    const key = { painting: 'painting', chart: 'chart', stars: 'stars', door: 'door' }[id];
    content.innerHTML = image(key, castleContent.views[0].hotspots.find(s => s.id === id).label);
  }
  for (const canvas of content.querySelectorAll('canvas[data-symbol]')) drawGraph(canvas, constellations.find(c => c.symbol === canvas.dataset.symbol).graph);
}

function drawCompartment(reveal) {
  const taken = game.state.flags.crystal_taken;
  $('#panel-title').textContent = '油畫暗格';
  $('#panel-content').innerHTML = `<div class="art compartment-art ${reveal ? 'revealing' : ''}"><img src="${src('compartment')}" alt="油畫向右滑開，露出牆上暗格">${taken ? '' : `<button data-action="take-crystal" class="crystal-holder" aria-label="取得日月雙色水晶"><img class="crystal-sprite crystal-dim" src="${src('crystalDim')}" alt=""><img class="crystal-sprite crystal-lit" src="${src('crystal')}" alt="左金右銀的日月雙色水晶"></button>`}${reveal ? `<img class="sliding-painting" src="${src('painting')}" alt="">` : ''}</div>${taken ? '<p class="caption">水晶已取走，暗格是空的。</p>' : '<p class="caption">點擊暗格內的水晶拾取。</p>'}<div class="actions">${actionButton('show-chart', '查看星象對照圖', 'quiet')}</div>`;
}

$('#panel-content').addEventListener('click', event => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'read-book') {
    sound.play('paper');
    $('#panel-content').innerHTML = `<div class="art book-pages"><img src="${src('bookOpen')}" alt="魔法書展開的羊皮紙內頁"><div class="writing poem"><h3>魔法師的筆記</h3>${poem.map(line => `<p><strong>${line[0]}</strong>${line.slice(1)}</p>`).join('')}</div><div class="writing hint"><h3>留給學徒</h3><p>${directionHint}</p><p>封面右下角<br><b>1976</b></p></div></div><div class="actions">${actionButton('book-cover', '查看封面')}</div>`;
    $('#panel-message').textContent = '筆記可以隨時回來重讀。';
  }
  if (action === 'book-cover') { sound.play('paper'); drawPanel('book'); }
  if (action === 'open-box') openPanel('box');
  if (action === 'take-lens') { say(audible('take_lens', game.act('take_lens'))); render(); drawPanel('box'); }
  if (action === 'toggle-lens') { say(audible('toggle-lens', game.toggleLens())); drawPanel('painting'); }
  if (action === 'show-chart') openPanel('chart');
  if (action === 'show-painting') openPanel('painting');
  if (action === 'show-stars') openPanel('stars');
  if (action === 'show-door') openPanel('door');
  if (action === 'show-book') openPanel('book');
  if (action === 'insert-crystal') { say(audible('insert_crystal', game.act('insert_crystal', 'crystal'))); render(); drawPanel('door'); }
  if (action === 'sun' || action === 'moon') {
    const flags = game.state.flags;
    const direction = action === 'sun' ? (flags.sun_up ? 'down' : 'up') : (flags.moon_right ? 'left' : 'right');
    say(audible(action, game.setDirection(action, direction))); drawPanel('door');
    $(`[data-action="${action}"]`).focus();
  }
  if (action === 'solve-door') {
    const result = audible('solve_door', game.act('solve_door')); say(result);
    if (result.ok) {
      closePanel(); render(); $('#ending').hidden = true;
      const completedRound = round;
      say({ message: '結界正在消散……' });
      $('#room-image').decode().then(() => {
        if (round !== completedRound || !game.state.flags.escaped) return;
        $('#ending').hidden = false;
        $('#scene').classList.add('escaped');
        $('#ending h2').setAttribute('tabindex', '-1'); $('#ending h2').focus();
        say(result);
      }).catch(() => {
        if (round === completedRound) say({ message: '開門圖片載入失敗，請按重新開始後再試。' });
      });
    }
  }
  if (action === 'cycle-symbol') {
    sound.play('symbol');
    const slot = Number(event.target.closest('[data-slot]').dataset.slot);
    symbolChoices[slot] = (symbolChoices[slot] + 1) % constellations.length;
    drawPanel('stars');
    $(`[data-slot="${slot}"]`).focus();
    say({ message: `第 ${slot+1} 格已選擇${constellations[symbolChoices[slot]].name} ${constellations[symbolChoices[slot]].symbol}。` });
  }
  if (action === 'solve-stars') {
    const result = audible('solve_stars', game.act('solve_stars', symbolChoices.map(i => constellations[i].symbol)));
    say(result);
    if (result.ok) { render(); drawPanel('painting', true); }
  }
  if (action === 'take-crystal') { say(audible('take_crystal', game.act('take_crystal'))); render(); drawCompartment(false); }
});
$('#panel-content').addEventListener('input', event => { if (event.target.id === 'code') sound.play('dial'); });
$('#panel-content').addEventListener('submit', event => {
  if (event.target.id !== 'code-form') return;
  event.preventDefault();
  const result = audible('solve_box', game.act('solve_box', $('#code').value));
  say(result);
  if (result.ok) { render(); drawPanel('box'); }
});

function closePanel() {
  $('#investigation').close();
  game.close();
  lastFocus?.focus();
}

function restart() {
  sound.reset();
  round++;
  $('#restart-confirm').close();
  $('#investigation').close();
  game.restart();
  symbolChoices = [0, 0, 0];
  $('#scene').classList.remove('escaped');
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
    button.addEventListener('click', () => openPanel(spot.id));
    $('#hotspots').append(button);
    const entry = document.createElement('button');
    entry.className = 'quiet'; entry.textContent = spot.label;
    entry.setAttribute('aria-label', `調查${spot.label}`);
    entry.addEventListener('click', () => openPanel(spot.id));
    $('#mobile-objects').append(entry);
  }
  const mobileScreen = window.matchMedia('(max-width: 640px)');
  const updateSceneAccess = () => {
    for (const button of document.querySelectorAll('.hotspot')) {
      button.setAttribute('aria-hidden', String(mobileScreen.matches));
      button.tabIndex = mobileScreen.matches ? -1 : 0;
    }
  };
  mobileScreen.addEventListener('change', updateSceneAccess); updateSceneAccess();
  $('#start').addEventListener('click', () => {
    sound.start(); sound.play('click');
    $('#start').disabled = true;
    $('#intro').classList.add('leaving');
    setTimeout(() => { $('#intro').close(); $('#start').disabled = false; say(game.start()); render(); $(mobileScreen.matches ? '#mobile-objects button' : '.hotspot').focus(); }, 250);
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

})();
