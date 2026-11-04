import { castleContent } from './castle-content.js';
import { loadGameContent } from './validate-content.js';

// 遊戲資料與畫面分離；讀取 state 時回傳副本，外部不能偷偷修改進度。
export function createGame(content = castleContent) {
  loadGameContent(content);
  let state = structuredClone(content.initialState);
  let panel = null;
  const reply = (ok, message) => ({ ok, message });
  return {
    get state() { return structuredClone(state); },
    get panel() { return panel; },
    start() { state.flags.started = true; return reply(true, '仔細調查書房，尋找解除結界的方法。'); },
    open(id) {
      if (!state.flags.started || state.flags.escaped) return reply(false, '請先開始新遊戲。');
      const spot = content.views.flatMap(view => view.hotspots).find(spot => spot.id === id);
      const interaction = content.interactions.find(action => action.id === spot?.interactionId);
      if (!interaction) return reply(false, '找不到這個調查物件。');
      panel = id;
      return reply(true, content.clues.find(clue => clue.id === interaction.clueId)?.text ?? interaction.feedback.success);
    },
    close() { panel = null; },
    restart() { state = structuredClone(content.initialState); panel = null; return reply(true, '新遊戲已開始。'); }
  };
}
