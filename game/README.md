# 古堡逃脫遊戲

完整操作、檔案、三階段謎題與測試紀錄見 [GAME.md](GAME.md)。

直接雙擊 `game/index.html`，用 Chrome 開啟即可遊玩；保留旁邊的 `asset/` 素材資料夾。

開發時可執行 `node game/serve.js`，開啟 <http://127.0.0.1:4173/game/index.html>。修改原始模組後，先以 `node game/build-browser.js` 更新直接開檔的版本，再執行 `node --test`；`node tests/browser-check.js` 同時驗證直接開檔與本機網址（需已有 Playwright 與瀏覽器）。
