// 正式古堡內容；game-content.js 保留作為第一版格式的教學範例。
export const assets = {
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

export const letter = [
  '親愛的學徒：',
  '實驗似乎發生了意料之外的變化，書房的大門已被結界封鎖。',
  '我在書房中留下了解開機關的線索。仔細觀察周遭的物品，善用你所學過的知識，相信你一定能找到離開的方法。',
  '切記，真正的答案往往藏在最不起眼的地方。'
];

const objects = [
  ['book', '魔法書', [43, 48, 15, 12], '書桌上的魔法書留下了學徒所需的線索。'],
  ['trash', '垃圾桶', [27, 72, 8, 17], '黃銅垃圾桶裡藏著一只金屬密碼箱。'],
  ['painting', '深夜觀星者', [41, 4, 18, 40], '《深夜觀星者》描繪一位手持手稿、仰望夜空的魔法師。'],
  ['chart', '星象對照圖', [62, 17, 11, 20], '十二星座星象對照圖，可用來比對連線與星座符號。'],
  ['stars', '星座機關', [43, 44, 14, 4], '油畫下有三個星座符號方框。不限排列順序。'],
  ['door', '結界大門', [80, 8, 17, 86], '藍紫色結界封住了大門，中央機關有一個水晶插槽。']
];

export const castleContent = {
  schemaVersion: 1,
  room: { id: 'castle_study', title: '禁忌實驗室：古堡逃脫', startViewId: 'study', description: '你是魔法師的學徒。實驗失控，讓你受困於古堡書房。' },
  views: [{ id: 'study', title: '魔法師書房', hotspots: objects.map(([id, label, rect]) => ({ id, label, rect, interactionId: `inspect_${id}` })) }],
  items: [],
  clues: objects.map(([id,,, text]) => ({ id: `clue_${id}`, hotspotId: id, text })),
  puzzles: [],
  interactions: objects.map(([id,,, text]) => ({ id: `inspect_${id}`, kind: 'inspect', clueId: `clue_${id}`, feedback: { success: text } })),
  initialState: { viewId: 'study', inventory: [], flags: { started: false, escaped: false } }
};
