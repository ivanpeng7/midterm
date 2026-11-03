# 遊戲骨架

這個資料夾目前包含第一個房間的內容資料與格式檢查，尚未有可玩的畫面。

- `game-content.js`：房間、可點區域、線索、密碼謎題、道具及出口的資料。
- `validate-content.js`：檢查資料版本、欄位、識別碼、引用、座標和效果。`validateGameContent` 回傳錯誤清單；`loadGameContent` 遇到錯誤會停止載入並指出位置。
- `content.test.js`：格式檢查的測試。

在專案根目錄執行 `node --test game/content.test.js` 即可檢查。後續畫面和實際互動會依 `PLANS.md` 的第 2～6 步加入。
