# 《禁忌實驗室：古堡逃脫》

依 `BRIEF_v1.md`、`PLANS.md`、`TEST.md` 開發。`BRIEF.md` 未存在；以計畫指定的 `BRIEF_v1.md` 為準。只使用 HTML、CSS、JavaScript，不修改 `VERIFY.md`。

## 啟動

在專案根目錄執行 `node game/serve.js`，用瀏覽器開啟 <http://127.0.0.1:4173/game/index.html>。結束伺服器按 Ctrl+C。JavaScript 模組需經 HTTP 載入，請使用上述網址。

測試指令：`node --test`。

## 檔案

- `index.html`、`style.css`、`app.js`：畫面、排版與玩家操作。
- `castle-content.js`：正式古堡資料、素材路徑、線索、答案與效果。
- `engine.js`：獨立遊戲狀態；畫面關閉不重設進度。
- `validate-content.js`：載入前檢查資料。
- `game-content.js`：保留的 `0427` 格式範例，不是正式遊戲。
- `serve.js`：僅供本機使用的靜態伺服器，無須安裝套件。

## 操作

點擊書房內有文字標示的物件調查；可用 Tab 選取、Enter 操作。關閉按鈕或 Esc 返回書房。重新開始會先詢問是否清空本局。

## 開發與測試紀錄（2026-11-04）

本輪起點 `868f71f`；開始前已有使用者修改的 `AGENTS.md`、`PLANS.md`，以及未追蹤的 `VERIFY.md`、`VERIFY_v1.md`，均保留。基準 `node --test`：14 項通過。

| 計畫步驟 | 先行測試提交 | 失敗原因 | 實作後全部測試 |
| --- | --- | --- | --- |
| 2：開場與書房 | `ae4b27f`，`tests/room.test.js` | 正式內容與引擎模組尚未存在 | 18／18；U-01～U-03、M-09 的資料及頁面入口檢查 |

此表的自動測試通過不代表素材組合與瀏覽器實玩已完成，最終實玩另行記錄。

已取得使用者同意：保留所有原始 PNG，在油畫與對照圖上由 JavaScript 疊加一致連線圖，解決原始素材連線難以逐一比對的問題。
