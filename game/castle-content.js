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

export const poem = ['樂音迴響古堡間，', '色彩斑斕幻影連，', '桶中暗藏玄機在，', '內尋方知鎖鎖牽。'];
export const directionHint = '日守天頂，月循右方，雙曜歸位，結界自解。';

const objects = [
  ['book', '魔法書', [43, 48, 15, 12], `封面右下角：1976。\n${poem.join('\n')}\n${directionHint}`],
  ['trash', '垃圾桶', [27, 72, 8, 17], '黃銅垃圾桶裡藏著一只金屬密碼箱。'],
  ['painting', '深夜觀星者', [41, 4, 18, 40], '《深夜觀星者》描繪一位手持手稿、仰望夜空的魔法師。'],
  ['chart', '星象對照圖', [62, 17, 11, 20], '十二星座星象對照圖，可用來比對連線與星座符號。'],
  ['stars', '星座機關', [43, 44, 14, 4], '油畫下有三個星座符號方框。不限排列順序。'],
  ['door', '結界大門', [80, 8, 17, 86], '藍紫色結界封住了大門，中央機關有一個水晶插槽。']
];

export const castleContent = {
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
