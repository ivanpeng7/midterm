# 2D 密室逃脫遊戲計畫

## 目前已確認的範圍

- 第一個可玩版本是一個能從新遊戲一路玩到逃出的房間。
- 玩家要能查看場景、點擊物件、收集與使用道具、解開謎題，最後打開出口。
- 程式只使用 HTML、CSS 和 JavaScript。遊戲引擎、平台、美術風格與劇情尚未決定。
- 目前儲存庫尚無遊戲程式、內容檔、測試、`BRIEF.md` 或 `VERIFY.md`。以下檔案格式是**待實作的提議**，不是既有格式。

## 遊戲內容檔格式規範（提議）


### 檔案與用途

- 使用 `game-content.js`，以 JavaScript 模組匯出一個 `gameContent` 物件。這符合專案只使用 HTML、CSS、JavaScript 的限制；實際路徑等建立程式時再決定。
- 內容檔只描述房間、畫面、可點擊區域、道具、線索、謎題與互動結果。畫面繪製、點擊判定、道具欄和遊戲存檔由程式處理。
- 內容檔不放會直接改變遊戲狀態的函式。互動結果用下方列出的資料欄位表示，方便檢查線索、答案及狀態是否一致。
- 識別碼使用不重複的英文字母、數字和底線，例如 `desk_note`。顯示給玩家的名稱及訊息則使用繁體中文。

### 頂層欄位

| 欄位 | 型別 | 規則 |
| --- | --- | --- |
| `schemaVersion` | 數字 | 格式版本；第一版為 `1`。 |
| `room` | 物件 | `id`、`title`、`startViewId`；起始畫面必須存在。 |
| `views` | 陣列 | 至少一個畫面；每個畫面有 `id`、`title`、`hotspots`。 |
| `items` | 陣列 | 每個道具有 `id`、`name`、`description`、`consumable`。 |
| `clues` | 陣列 | 每條線索有 `id`、`hotspotId`、`text`；玩家能重看。 |
| `puzzles` | 陣列 | 每題有 `id`、`clueIds`、`targetHotspotId`、`answer`、`solution`、`onSolved`。 |
| `interactions` | 陣列 | 每個可點擊區域對應一個互動規則，見下表。 |
| `initialState` | 物件 | 新遊戲時的 `viewId`、`inventory`、`flags`；不得預先擁有未取得的道具。 |

### 畫面、互動與狀態

| 資料 | 必要欄位與限制 |
| --- | --- |
| `views[].hotspots[]` | `id`、`label`、`rect`、`interactionId`。`rect` 為 `[x, y, width, height]`，數值使用畫面百分比 `0`～`100`，不得超出畫面；可點區域要足夠明顯。`interactionId` 必須指向一條互動規則。 |
| `interactions[]` | `id`、`kind`、`feedback`。`feedback` 至少包含成功訊息；可能失敗的互動也要有失敗訊息。支援的 `kind` 為 `inspect`、`take`、`enterCode`、`useItem`、`switchView`。 |
| `inspect` | 用 `clueId` 指向線索；每次點擊都能再次顯示該線索。 |
| `take` | 用 `itemId` 指向道具；成功時加入道具欄，重複取得時顯示已取得訊息，不重複加入。 |
| `enterCode` | 用 `puzzleId` 指向謎題；以字串比較答案，保留前導零。答錯時顯示訊息，不改變可通關狀態。 |
| `useItem` | 用 `itemId` 指定需要的道具，`onSuccess` 指定成功效果。缺少道具時顯示訊息；只有 `consumable: true` 的道具才可由效果移除。 |
| `switchView` | 用 `toViewId` 指向目標畫面。換畫面後，道具欄與旗標狀態保持不變。 |
| `flags` | 記錄抽屜是否打開、出口是否開啟等布林狀態。狀態以旗標及道具欄為準，不在多處各存一份。 |
| 效果 | `onSolved`、`onSuccess` 是效果陣列。第一版只用 `{ type: "setFlag", flag, value }`、`{ type: "addItem", itemId }`、`{ type: "removeItem", itemId }`。勝利由 `flags.escaped === true` 判定。 |

所有引用都要指向實際存在的識別碼，包括起始畫面、互動、道具、線索、謎題及目標畫面。謎題的 `clueIds` 必須列出能推導答案的線索；`solution` 要寫明解法。重要資訊應有文字，不能只靠顏色表示。尚未定案的畫面圖片或版面可以先用 CSS 呈現，不必在內容檔虛構素材路徑。

### 欄位型別、必填與選填細節

本節是上述提議格式的詳細規則；尚未表示已經有讀取或檢查程式。

- 所有頂層欄位都必填。沒有道具或線索時，對應陣列寫成 `[]`，不可省略。
- 檔案使用 UTF-8 編碼。資料只使用文字、有限數字、布林值、陣列及一般物件；不使用函式、`undefined`、`NaN` 或 `Infinity`。
- 識別碼須符合 `^[a-z][a-z0-9_]*$`，且在整份內容檔中唯一。例如 `door_key` 合法，`Door Key` 不合法。引用欄位不算重新宣告識別碼。
- 必填文字不能只有空白；布林值只能寫 `true` 或 `false`，不能寫成文字 `"false"`。
- 未列出的欄位視為格式錯誤，避免把 `itemId` 誤寫成 `itemID` 卻沒有被發現。選填欄位不用時直接省略，不填 `null`。
- 第一版只接受 `schemaVersion: 1`；遇到其他版本應停止載入並說明不支援。未來若變更欄位意義或移除欄位，須更新版本及對應讀取規則。

| 資料 | 欄位型別與必填規則 |
| --- | --- |
| 房間 `room` | `id`、`title`、`startViewId` 均為必填文字；選填 `description`，用文字介紹房間。 |
| 畫面 `views[]` | `id`、`title` 為必填文字，`hotspots` 為必填陣列；選填 `description`。畫面連接由 `switchView` 互動表示。 |
| 可點區域 `hotspots[]` | `id`、`label`、`interactionId` 為必填文字；`rect` 必須恰有四個有限數字。 |
| 道具 `items[]` | `id`、`name`、`description` 為必填文字；`consumable` 為必填布林值。取得位置與用途由引用此道具的互動或效果表示。 |
| 線索 `clues[]` | `id`、`hotspotId`、`text` 均為必填文字；所在畫面由 `hotspotId` 所屬的畫面判定。 |
| 謎題 `puzzles[]` | `id`、`targetHotspotId`、`answer`、`solution`、`solvedFlag` 為必填文字；`clueIds` 為至少一個線索編號的陣列；`onSolved` 為至少一個效果的陣列。第一版只支援數字密碼題。 |
| 互動 `interactions[]` | `id`、`kind` 為必填文字，`feedback` 為必填物件；其他欄位依互動種類決定，見下表。 |
| 初始狀態 `initialState` | `viewId` 為必填文字，必須等於 `room.startViewId`；`inventory` 為道具編號陣列，第一版新遊戲為 `[]`；`flags` 為旗標名稱對應布林值的物件。 |

`rect` 的原點為場景左上角，`x` 向右增加，`y` 向下增加；計算範圍只包含場景，不含道具欄或訊息框。寬、高必須大於零，且 `x + width <= 100`、`y + height <= 100`。例如 `[10, 25, 12, 15]` 表示從左側 10%、上方 25% 處開始，寬占 12%、高占 15%。縮放畫面時，圖像及點擊區域必須一起縮放。第一版避免可點區域重疊，以免一次點擊觸發兩個物件。

### 各種互動的必要欄位

| `kind` | 除共同欄位外的必填資料 | 文字回饋要求 |
| --- | --- | --- |
| `inspect` | `clueId`：線索編號 | `success`；顯示線索時以 `clues[].text` 為內容來源，避免把不同版本的線索分散存放。 |
| `take` | `itemId`：道具編號；`onceFlag`：是否已取得的旗標名稱 | `success`、`repeated`；成功時加入道具並將 `onceFlag` 設為 `true`。 |
| `enterCode` | `puzzleId`：謎題編號 | `success`、`failure`、`repeated`。 |
| `useItem` | `itemId`：需要的道具編號；`onceFlag`：是否已完成的旗標名稱；`onSuccess`：非空效果陣列 | `success`、`failure`、`repeated`。 |
| `switchView` | `toViewId`：目標畫面編號 | `success`。 |

`feedback.success`、`feedback.failure`、`feedback.repeated` 都是非空文字。只填該互動需要的欄位，例如 `switchView` 不填 `itemId`。`inspect` 對應的線索必須位於觸發它的可點區域；`enterCode` 對應的謎題，其 `targetHotspotId` 也必須是觸發該互動的區域。

### 答案、效果與重複操作規則

- `answer` 必須是由半形數字 `0`～`9` 組成的非空字串，例如 `"0427"`。輸入答案時只去除前後空白，不轉成數字、不刪除中間空白，也不自動轉換全形數字。因此 `" 0427 "` 正確，`"427"`、`"04 27"`、`"０４２７"` 都不相同。
- `solvedFlag`、`onceFlag` 及所有效果引用的旗標，都必須先在 `initialState.flags` 宣告。旗標名稱使用與識別碼相同的命名規則；它們屬於狀態名稱，不是內容物件的編號。每個一次性互動或謎題使用自己的完成旗標，初始為 `false`。
- 謎題先檢查 `solvedFlag`，已解開就顯示 `repeated`；未解開才比較答案。`onSolved` 必須包含把該 `solvedFlag` 設為 `true` 的效果。
- `take` 先檢查 `onceFlag`。取得一次後，即使道具日後被消耗，也不能再次領取。
- `useItem` 先檢查 `onceFlag`，再檢查玩家選用的道具是否正確且仍在道具欄；未選、選錯或沒有道具時顯示 `failure`。`onSuccess` 必須包含把該 `onceFlag` 設為 `true` 的效果。
- `addItem` 只加入尚未持有的道具；道具欄不保留同一道具的多份副本。`removeItem` 只能移除目前持有且 `consumable: true` 的道具。`consumable: true` 只表示允許消耗，實際消耗仍須明寫 `removeItem`。
- `setFlag` 的 `flag` 必須存在，`value` 必須是布林值。第一版不允許將已完成的謎題或一次性互動旗標改回 `false`；重新開始遊戲才重設。
- 一組效果全部檢查合法後才一次套用，不能出現「道具已消失，但門沒有打開」的部分完成狀態。答案錯誤、道具錯誤或效果失敗都不得改變原有狀態。
- 程式以 `solvedFlag` 或 `onceFlag` 判定是否完成，不用「現在是否持有獎勵道具」判定。例如鑰匙已被消耗，也不代表抽屜重新上鎖。

效果物件的欄位固定如下，不接受其他效果種類：

| `type` | 其他必填欄位 | 例子 |
| --- | --- | --- |
| `setFlag` | `flag`：旗標名稱文字；`value`：布林值 | `{ type: "setFlag", flag: "escaped", value: true }` |
| `addItem` | `itemId`：道具編號文字 | `{ type: "addItem", itemId: "door_key" }` |
| `removeItem` | `itemId`：可消耗道具編號文字 | `{ type: "removeItem", itemId: "battery" }`；僅示範語法，正式內容須另行宣告此道具。 |

### 初始狀態、通關與重新開始

- 新遊戲從 `initialState` 建立獨立的遊玩狀態，不能直接改寫內容檔中的初始資料。
- 切換畫面只改變目前的 `viewId`；道具與旗標保留。關閉線索視窗或密碼輸入框也不重設進度。
- `escaped` 是必填旗標，新遊戲為 `false`；只有完成出口的成功互動才設為 `true`，並顯示勝利畫面。
- 通關後停止改變謎題、道具及門鎖狀態，提供重新開始入口；重新開始會清空道具並還原全部初始旗標。
- 重要線索須能重看；道具取得後可在道具欄查看 `description`。可消耗道具若包含通關必需的線索，消耗後仍須有另一個可重看的線索入口。
- 本規範尚未決定是否跨重新整理保存進度。若日後加入存檔，須另外規定存檔版本、格式檢查與不相容時的處理方式。

### 格式檢查與內容驗收

載入時先檢查欄位、型別、版本、識別碼、引用、座標及效果。任一錯誤都應阻止進入遊戲，列出資料位置及原因。例如：`puzzles[0].clueIds[0]：找不到線索 note_code`。給玩家顯示「遊戲內容載入失敗」，詳細資料位置供開發時查看。

資料合法不代表一定能通關；仍須實際遊玩確認以下條件：

- 線索能在使用答案之前取得，不會把解鎖必需的紙條放在同一個上鎖抽屜內。
- 每題記錄線索位置、答案、解法及獎勵或解鎖結果，線索能合理推導答案。
- 重複拿取、重複解題、錯誤密碼、錯誤道具及取消輸入都不會造成卡關。
- 切換畫面後，抽屜、出口及道具狀態一致；新遊戲則確實重設。
- 可點區域有可辨認的文字或外觀提示，重要內容不只依靠顏色傳達。

### 最小範例

以下範例展示「看紙條 → 輸入密碼 → 取得鑰匙 → 開門」的資料關係。座標僅供示意，實作時須依畫面調整。

```js
export const gameContent = {
  schemaVersion: 1,
  room: { id: "first_room", title: "第一個房間", startViewId: "room_view" },
  views: [{
    id: "room_view",
    title: "房間",
    hotspots: [
      { id: "note", label: "紙條", rect: [10, 25, 12, 15], interactionId: "read_note" },
      { id: "drawer", label: "上鎖抽屜", rect: [36, 55, 22, 16], interactionId: "open_drawer" },
      { id: "door", label: "出口", rect: [76, 15, 18, 70], interactionId: "open_door" }
    ]
  }],
  items: [{ id: "door_key", name: "鑰匙", description: "出口的鑰匙", consumable: false }],
  clues: [{ id: "note_code", hotspotId: "note", text: "紙條寫著：0427。" }],
  puzzles: [{
    id: "drawer_code",
    clueIds: ["note_code"],
    targetHotspotId: "drawer",
    answer: "0427",
    solvedFlag: "drawer_open",
    solution: "閱讀紙條，將四位數 0427 輸入抽屜密碼鎖。",
    onSolved: [
      { type: "setFlag", flag: "drawer_open", value: true },
      { type: "addItem", itemId: "door_key" }
    ]
  }],
  interactions: [
    { id: "read_note", kind: "inspect", clueId: "note_code",
      feedback: { success: "紙條寫著：0427。" } },
    { id: "open_drawer", kind: "enterCode", puzzleId: "drawer_code",
      feedback: { success: "抽屜打開了，你拿到鑰匙。", failure: "密碼不對。", repeated: "抽屜已經打開。" } },
    { id: "open_door", kind: "useItem", itemId: "door_key", onceFlag: "escaped",
      onSuccess: [{ type: "setFlag", flag: "escaped", value: true }],
      feedback: { success: "你打開出口，逃出房間！", failure: "需要鑰匙。", repeated: "出口已經打開。" } }
  ],
  initialState: { viewId: "room_view", inventory: [], flags: { drawer_open: false, escaped: false } }
};
```

正式內容應讓使用者能從道具欄再次查看取得的物品；若某條重要線索藏在會消失的物件上，也須提供可重看的入口。範例的紙條不會消失，因此可反覆點擊。

## 實作步驟

每一步遵守專案的 TDD 流程：先寫該步測試、執行並確認失敗、提交測試，再實作、執行全部測試確認通過、提交程式，最後在此勾選。不得為了讓測試通過而修改測試。

- [x] 1. 建立內容檔與格式檢查：能載入資料，拒絕缺漏欄位、重複識別碼、無效引用與越界座標。
- [ ] 2. 顯示房間畫面及可點擊區域；點擊後有清楚的文字回饋。
- [ ] 3. 實作可重看的線索，以及道具取得、查看、重複點擊與道具欄。
- [ ] 4. 實作密碼謎題：正確答案解鎖，錯誤答案不改變可通關狀態。
- [ ] 5. 實作使用道具、出口與勝利畫面；切換畫面後維持狀態。
- [ ] 6. 從新遊戲實際玩到結尾，檢查錯誤答案、重複點擊、道具使用及畫面切換。

## 尚未決定
