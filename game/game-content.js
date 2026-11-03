// 第一個房間的資料範例；畫面與互動程式會在後續步驟加入。
export const gameContent = {
  schemaVersion: 1,
  room: { id: 'first_room', title: '第一個房間', startViewId: 'room_view' },
  views: [{
    id: 'room_view',
    title: '房間',
    hotspots: [
      { id: 'note', label: '紙條', rect: [10, 25, 12, 15], interactionId: 'read_note' },
      { id: 'drawer', label: '上鎖抽屜', rect: [36, 55, 22, 16], interactionId: 'open_drawer' },
      { id: 'door', label: '出口', rect: [76, 15, 18, 70], interactionId: 'open_door' }
    ]
  }],
  items: [{ id: 'door_key', name: '鑰匙', description: '出口的鑰匙', consumable: false }],
  clues: [{ id: 'note_code', hotspotId: 'note', text: '紙條寫著：0427。' }],
  puzzles: [{
    id: 'drawer_code',
    clueIds: ['note_code'],
    targetHotspotId: 'drawer',
    answer: '0427',
    solvedFlag: 'drawer_open',
    solution: '閱讀紙條，將四位數 0427 輸入抽屜密碼鎖。',
    onSolved: [
      { type: 'setFlag', flag: 'drawer_open', value: true },
      { type: 'addItem', itemId: 'door_key' }
    ]
  }],
  interactions: [
    { id: 'read_note', kind: 'inspect', clueId: 'note_code', feedback: { success: '你看見紙條上的數字。' } },
    { id: 'open_drawer', kind: 'enterCode', puzzleId: 'drawer_code',
      feedback: { success: '抽屜打開了，你拿到鑰匙。', failure: '密碼不對。', repeated: '抽屜已經打開。' } },
    { id: 'open_door', kind: 'useItem', itemId: 'door_key', onceFlag: 'escaped',
      onSuccess: [{ type: 'setFlag', flag: 'escaped', value: true }],
      feedback: { success: '你打開出口，逃出房間！', failure: '需要鑰匙。', repeated: '出口已經打開。' } }
  ],
  initialState: { viewId: 'room_view', inventory: [], flags: { drawer_open: false, escaped: false } }
};
