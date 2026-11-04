// 使用原始素材；只限制單次音效播放長度，不改動音檔。
export const audioTracks = {
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

export function createGameAudio({ makeAudio = url => new Audio(url), schedule = setTimeout, cancel = clearTimeout } = {}) {
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
