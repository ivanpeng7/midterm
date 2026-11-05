// 影片只在本局確定通關後載入；失敗、關閉或重開都不改變遊戲進度。
export function createEndingVideo({ video, dialog, retry, status, muted = () => false, onStart = () => {} }) {
  let active = false, generation = 0, failed = false;
  const stop = () => {
    generation++; active = false;
    video.pause();
    try { video.currentTime = 0; } catch { /* 尚無影格時也可關閉。 */ }
    video.removeAttribute('src'); video.load();
    retry.hidden = true; status.textContent = '';
  };
  const close = () => { stop(); if (dialog.open) dialog.close(); };
  const attempt = () => {
    if (!active || !dialog.open || failed) return;
    const current = ++generation;
    const blocked = () => {
      if (!active || !dialog.open || current !== generation || failed) return;
      retry.hidden = false;
      status.textContent = '請按「播放影片」開始播放通關影片。';
    };
    try {
      Promise.resolve(video.play()).then(() => {
        if (active && dialog.open && current === generation && !failed) { retry.hidden = true; status.textContent = ''; }
      }).catch(blocked);
    } catch { blocked(); }
  };
  retry.addEventListener('click', attempt);
  dialog.addEventListener('close', stop);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  video.addEventListener('error', () => {
    if (!active) return;
    failed = true; retry.hidden = true;
    status.textContent = '影片無法播放，你已成功逃脫，可以關閉影片繼續。';
  });
  return {
    show(won) {
      if (won !== true || active || dialog.open) return;
      active = true; failed = false;
      retry.hidden = true; status.textContent = '';
      video.muted = muted(); video.src = '../asset/superidol.mp4';
      onStart(); dialog.showModal(); attempt();
    },
    close,
    setMuted(value) { video.muted = Boolean(value); },
    setVisible(value) {
      if (!active) return;
      if (!value) { generation++; video.pause(); }
      else if (video.paused && !failed) { retry.hidden = false; status.textContent = '請按「播放影片」繼續播放。'; }
    }
  };
}
