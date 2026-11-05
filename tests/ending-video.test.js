import test from 'node:test';
import assert from 'node:assert/strict';
import { createEndingVideo } from '../game/ending-video.js';

function setup() {
  const handlers = target => Object.assign(target, { events: {}, addEventListener(name, fn) { this.events[name] = fn; } });
  const video = handlers({ paused: true, currentTime: 0, src: '', muted: false, plays: 0, rejected: false,
    play() { this.plays++; if (this.rejected) return Promise.reject(new Error('播放被擋')); this.paused = false; return Promise.resolve(); },
    pause() { this.paused = true; }, removeAttribute(name) { if (name === 'src') this.src = ''; }, load() {} });
  const dialog = handlers({ open: false, showModal() { this.open = true; }, close() { this.open = false; this.events.close?.(); } });
  const retry = handlers({ hidden: true }), status = { textContent: '' };
  let muted = false, starts = 0;
  const player = createEndingVideo({ video, dialog, retry, status, muted: () => muted, onStart: () => starts++ });
  return { player, video, dialog, retry, status, get starts() { return starts; }, mute() { muted = true; } };
}

test('通關影片：未通關不載入或播放，通關後只開啟一次且使用指定素材', () => {
  const s = setup(); s.player.show(false);
  assert.equal(s.video.src,''); assert.equal(s.video.plays,0); assert.equal(s.dialog.open,false);
  s.player.show(true); s.player.show(true);
  assert.equal(s.video.src,'../asset/superidol.mp4'); assert.equal(s.video.plays,1);
  assert.equal(s.dialog.open,true); assert.equal(s.starts,1);
});

test('通關影片：沿用靜音設定，播放器開啟後也能切換靜音', () => {
  const s = setup(); s.mute(); s.player.show(true); assert.equal(s.video.muted,true);
  s.player.setMuted(false); assert.equal(s.video.muted,false);
});

test('通關影片：播放被擋顯示手動按鈕，重試成功後隱藏提示', async () => {
  const s = setup(); s.video.rejected=true; s.player.show(true);
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(s.retry.hidden,false); assert.ok(s.status.textContent.includes('播放'));
  s.video.rejected=false; s.retry.events.click();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(s.video.paused,false); assert.equal(s.retry.hidden,true);
});

test('通關影片：關閉及重新開始停止播放、清空來源，下一局從頭播放', () => {
  const s = setup(); s.player.show(true); s.video.currentTime=8; s.player.close();
  assert.equal(s.video.paused,true); assert.equal(s.video.currentTime,0); assert.equal(s.video.src,''); assert.equal(s.dialog.open,false);
  s.player.show(true); assert.equal(s.video.plays,2); assert.equal(s.video.currentTime,0);
});

test('通關影片：關閉後舊播放失敗回呼不得重新顯示手動按鈕', async () => {
  const s = setup(); s.video.rejected=true; s.player.show(true); s.player.close();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(s.dialog.open,false); assert.equal(s.retry.hidden,true); assert.equal(s.status.textContent,'');
});

test('通關影片：分頁隱藏暫停，返回不擅自播放，仍可按播放繼續', async () => {
  const s = setup(); s.player.show(true); s.player.setVisible(false); assert.equal(s.video.paused,true);
  s.player.setVisible(true); assert.equal(s.video.plays,1); assert.equal(s.retry.hidden,false);
  s.retry.events.click(); await new Promise(resolve=>setImmediate(resolve)); assert.equal(s.video.paused,false);
});

test('通關影片：素材失敗或 Esc 關閉都不阻止回到通關畫面', () => {
  const s = setup(); s.player.show(true); s.video.events.error();
  assert.ok(s.status.textContent.includes('無法')); assert.equal(s.retry.hidden,true);
  let prevented=false; s.dialog.events.cancel({preventDefault(){prevented=true;}});
  assert.equal(prevented,true); assert.equal(s.dialog.open,false); assert.equal(s.video.paused,true);
});
