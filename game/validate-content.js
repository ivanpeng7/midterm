const idPattern = /^[a-z][a-z0-9_]*$/;
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isText = value => typeof value === 'string' && value.trim().length > 0;

// 回傳所有可辨識的格式錯誤，讓編輯內容的人能一次修正。
export function validateGameContent(content) {
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
    if (!isText(value)) return;
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
    if (!shape(puzzle, p, ['id', 'clueIds', 'targetHotspotId', 'answer', 'solution', 'solvedFlag', 'onSolved'])) continue;
    collect(puzzle.id, `${p}.id`, '謎題');
    for (const [j, clueId] of array(puzzle.clueIds, `${p}.clueIds`, 1).entries()) reference(clueId, `${p}.clueIds[${j}]`, '線索');
    reference(puzzle.targetHotspotId, `${p}.targetHotspotId`, '可點區域');
    if (typeof puzzle.answer !== 'string' || !/^\d+$/.test(puzzle.answer)) fail(`${p}.answer`, '必須是非空半形數字字串');
    text(puzzle.solution, `${p}.solution`);
    flag(puzzle.solvedFlag, `${p}.solvedFlag`);
    effects(puzzle.onSolved, `${p}.onSolved`);
    if (!hasFlagEffect(puzzle.onSolved, puzzle.solvedFlag)) fail(`${p}.onSolved`, '必須將完成旗標設為 true');
  }

  const kinds = {
    inspect: ['clueId'], take: ['itemId', 'onceFlag'], enterCode: ['puzzleId'],
    useItem: ['itemId', 'onceFlag', 'onSuccess'], switchView: ['toViewId']
  };
  const feedbackKeys = {
    inspect: ['success'], take: ['success', 'repeated'], enterCode: ['success', 'failure', 'repeated'],
    useItem: ['success', 'failure', 'repeated'], switchView: ['success']
  };
  const interactions = array(content.interactions, 'interactions');
  for (const [i, interaction] of interactions.entries()) {
    const p = `interactions[${i}]`;
    if (!isObject(interaction)) { fail(p, '必須是物件'); continue; }
    const kind = interaction.kind;
    if (!Object.hasOwn(kinds, kind)) { fail(`${p}.kind`, '不支援的互動種類'); continue; }
    if (!shape(interaction, p, ['id', 'kind', 'feedback', ...kinds[kind]])) continue;
    collect(interaction.id, `${p}.id`, '互動');
    if (shape(interaction.feedback, `${p}.feedback`, feedbackKeys[kind])) {
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
    if (kind === 'enterCode') {
      reference(interaction.puzzleId, `${p}.puzzleId`, '謎題');
      if (puzzles.find(puzzle => puzzle?.id === interaction.puzzleId)?.targetHotspotId !== spot?.id) fail(`${p}.puzzleId`, '謎題目標必須是觸發區域');
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
  return errors;
}

export function loadGameContent(content) {
  const errors = validateGameContent(content);
  if (errors.length) throw new Error(`遊戲內容載入失敗\n${errors.join('\n')}`);
  return content;
}
