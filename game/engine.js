import { castleContent } from './castle-content.js';
import { loadGameContent } from './validate-content.js';
import { constellations } from './constellations.js';

// 只對副本套用；任一效果不合法便整組失敗，原狀態保持完整。
export function applyEffects(state, effects, content) {
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
export function createGame(content = castleContent) {
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
      return reply(true, state.flags.lens_active ? '已啟用透鏡視角。仔細比對三處連線與星象對照圖。' : '已切回一般視角。');
    },
    describe(id) { return content.items.find(item => item.id === id && state.inventory.includes(id))?.description ?? '目前沒有這個道具。'; },
    start() { state.flags.started = true; return reply(true, '仔細調查書房，尋找解除結界的方法。'); },
    open(id) {
      if (!state.flags.started || state.flags.escaped) return reply(false, '請先開始新遊戲。');
      const spot = content.views.flatMap(view => view.hotspots).find(spot => spot.id === id);
      const interaction = content.interactions.find(action => action.id === spot?.interactionId);
      if (!interaction) return reply(false, '找不到這個調查物件。');
      panel = id;
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
