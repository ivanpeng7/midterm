# 《禁忌實驗室：古堡逃脫》遊戲視覺與音效素材需求清單 v2 (assets/README.md v2)

本文件依據 **`BRIEF.md v1`**、**`VERIFY.md v1`** 與 **`16 項音效素材對照與下載搜尋清單`** 完整通盤梳理，為 2D 點擊逃脫遊戲所需之所有視覺圖片與音效素材之完整規範、檔名命名與儲存結構說明。

所有素材檔案請依類型統一儲存於 `assets/` 目錄結構下：
* **視覺圖片**：統一儲存於 `assets/`（或 `assets/images/`），採小寫蛇形命名（`snake_case` / `kebab-case`）。
* **音效與音樂**：統一儲存於 `assets/audio/`，檔案格式統一為 **`.wav`**，採小寫蛇形命名（`snake_case`）。

---

## 1. 目錄結構與檔案命名規範

```text
assets/
├── bg_study.png
├── bg_study_unlocked.png
├── icon_crystal_dim.png
├── icon_crystal_glowing.png
├── icon_lens.png
├── magic_book_closed.png
├── modal_constellation_chart.png
├── modal_constellation_lock.png
├── modal_door_mechanism.png
├── modal_intro_letter.png
├── modal_lockbox.png
├── modal_magic_book_open.png
├── painting_secret_compartment.png
├── painting_stargazer_lens.png
├── painting_stargazer_normal.png
├── parchment_bg.png
├── trash_can_detail.png
└── audio/
    ├── bgm_mystic_study.wav
    ├── sfx_barrier_dispel.wav
    ├── sfx_click_button.wav
    ├── sfx_constellation_click.wav
    ├── sfx_crystal_charge.wav
    ├── sfx_crystal_insert.wav
    ├── sfx_door_open.wav
    ├── sfx_error_shake.wav
    ├── sfx_fireplace_crackle.wav
    ├── sfx_item_pickup.wav
    ├── sfx_lens_toggle.wav
    ├── sfx_lockbox_dial.wav
    ├── sfx_lockbox_open.wav
    ├── sfx_painting_slide.wav
    ├── sfx_paper_flip.wav
    └── sfx_switch_toggle.wav
```

---

## 2. 開場與 UI 介面 (Intro & UI Modals)

* **`modal_intro_letter.png`** / **`parchment_bg.png`**
  * **視覺描述**：開場信件特寫彈窗介面（Section 2）。以**泛黃羊皮紙**為背景，附有紅色蠟封（紅色封印），文字採手寫風格，完整呈現魔法師留給學徒的開場信內容（「親愛的學徒：實驗似乎發生了意料之外的變化...」）。
  * **按鈕 UI**：信件下方設置 **「明白，開始逃脫！」** 按鈕背景與互動樣式。

---

## 3. 主場景環境與基礎底圖 (Main Environment)

* **`bg_study.png`**
  * **視角與比例**：16:9 正視第一人稱視角（Player POV）。
  * **場景元素**（Section 3.1）：
    * **牆壁**：深綠色石磚牆。
    * **地板**：深胡桃木色木地板。
    * **左側**：石造壁爐，內有燃燒的橘黃色火光提供暖色主光源。
    * **中央**：胡桃木書桌（桌面擺放魔法書、燭台、羽毛筆與墨水瓶），右下角放置黃銅垃圾桶。
    * **牆面**：懸掛哥德式油畫《深夜觀星者》。
    * **右側**：黑橡木哥德式大門，門框周圍被清晰可見的**藍紫色魔法結界光暈**包覆。
  * **整體氛圍**：哥德式古堡、奇幻魔法與復古神秘風格。

* **`bg_study_unlocked.png`**
  * **視覺描述**：通關結局狀態底圖（Section 4.11 & 5）。藍紫色魔法結界消散，黑橡木大門向外開啟，門縫透出解鎖後的明亮光芒。

---

## 4. 第一階段：魔法書、垃圾桶與密碼箱素材 (Stage 1 Assets)

* **`magic_book_closed.png`**
  * **視覺描述**：擺放在書桌上的魔法書外觀特寫（Section 3.2）。深色皮革封面，**右下角以金色燙金字體印有四位數字「1976」**。
  * **重要規範**：依據 `BRIEF.md v1` 規定，**魔法書封面絕不繪製太陽或月亮圖騰**（避免誤導玩家）。

* **`modal_magic_book_open.png`**
  * **視覺描述**：點擊魔法書後彈出的**「調查魔法書與閱讀線索」特寫頁面（Section 4.1）**。
  * **內頁文字內容**：
    1. **四句藏頭詩**：
       > **樂**音迴響古堡間，  
       > **色**彩斑斕幻影連，  
       > **桶**中暗藏玄機在，  
       > **內**尋方知鎖鎖牽。  
       *(首字隱含諧音線索「樂色桶內 / 垃圾桶內」)*
    2. **日月方向提示（用於第三階段）**：
       > 日守天頂，月循右方，雙曜歸位，結界自解。

* **`trash_can_detail.png`**
  * **視覺描述**：書桌角落黃銅垃圾桶特寫（Section 3.3 & 4.2），桶內有揉皺的紙張，隱約露出藏在內部的金屬密碼箱。

* **`modal_lockbox.png`**
  * **視覺描述**：哥德式金屬密碼箱特寫彈窗（Section 3.3 & 4.2~4.3）。金屬雕花外框，中央包含 4 位數字撥號/輸入介面，供玩家輸入密碼 `1976`。

---

## 5. 第二階段：油畫、十二星座圖冊與機關素材 (Stage 2 Assets)

* **`painting_stargazer_normal.png`**
  * **視覺描述**：油畫《深夜觀星者》一般視角特寫（Section 3.4 & 4.5）。
  * **關鍵三要素（必備）**：
    1. **仰望的夜空與星空**：畫面上方夜幕與星辰。
    2. **魔法師的長袍**：魔法師身上穿著的哥德式魔法長袍。
    3. **魔法師手持的手稿**：魔法師雙手攤開持有的觀星手稿。

* **`painting_stargazer_lens.png`**
  * **視覺描述**：使用「魔法透鏡視角」觀察《深夜觀星者》時的顯影特寫（Section 4.5）。
  * **三組隱藏星座連線**：
    1. **夜空位置**：顯影發光的 **獅子座連線 (♌)**。
    2. **長袍位置**：顯影發光的 **巨蟹座連線 (♋)**。
    3. **手稿位置**：顯影發光的 **天蠍座連線 (♏)**。

* **`modal_constellation_chart.png`**
  * **視覺描述**：十二星座星象對照圖特寫彈窗（Section 4.6）。採用 **十二宮格** 排列，每格同時標註：
    * 該星座的星象連線圖。
    * 該星座的星座符號（♈ 牡羊、♉ 金牛、♊ 雙子、♋ 巨蟹、♌ 獅子、♍ 處女、♎ 天秤、♏ 天蠍、♐ 射手、♑ 摩羯、♒ 水瓶、♓ 雙魚）。
  * **統一規範**：介面文字統一稱為「星座符號」。

* **`modal_constellation_lock.png`**
  * **視覺描述**：油畫下方的星座符號機關介面（Section 4.7）。含三個可滾動切換十二星座符號的方框，上方明顯標註提示文字：**「不限排列順序」**。

* **`painting_secret_compartment.png`**
  * **視覺描述**：油畫向右滑開後露出的牆壁暗格特寫（Section 4.8）。暗格中央設有可嵌入日月水晶的浮雕凹槽。

---

## 6. 第三階段：大門黃銅日月機關 (Stage 3 Assets)

* **`modal_door_mechanism.png`**
  * **視覺描述**：古堡大門中央黃銅日月機關特寫介面（Section 3.5 & 4.9~4.10）。
  * **組件結構**：
    * **中央**：日月雙色水晶插槽。
    * **左側**：太陽方向控制裝置（設有「朝上」與「朝下」切換開關）。
    * **右側**：月亮方向控制裝置（設有「朝左」與「朝右」切換開關）。

---

## 7. 道具欄與可拾取物件圖示 (Inventory & Items)

* **`icon_lens.png`**
  * **描述**：黃銅魔法透鏡（Section 4.4）。單眼鏡片外觀，長約 12 公分，質感精緻。
  * **格式要求**：1:1 正方形去背 PNG 檔。

* **`icon_crystal_dim.png`**
  * **描述**：日月雙色水晶 - 黯淡狀態（Section 4.8）。未啟動時放置於暗格內，左半部金色太陽，右半部銀色月亮，表面無光澤。
  * **格式要求**：1:1 正方形去背 PNG 檔。

* **`icon_crystal_glowing.png`**
  * **描述**：日月雙色水晶 - 發光狀態（Section 4.8 & 4.11）。油畫滑開或插入大門機關後，水晶散發溫潤金銀雙色魔法光芒。
  * **格式要求**：1:1 正方形去背 PNG 檔。

---

## 8. 音效與背景音樂規格 (Audio Assets Specifications)

所有音效檔案請儲存於 **`assets/audio/`** 資料夾，副檔名**統一格式為 `.wav`**。

### 8.1 背景音樂與環境音 (BGM & Ambient)
* **`bgm_mystic_study.wav`**
  * **說明**：主場景懸疑哥德氛圍背景音樂（Loop 循環播放）。
* **`sfx_fireplace_crackle.wav`**
  * **說明**：書房左側石造壁爐柴火燃燒環境音。

### 8.2 通用 UI 與介面音效 (UI & General SFX)
* **`sfx_click_button.wav`**
  * **說明**：開場信件按鈕與系統選單點擊提示音。
* **`sfx_paper_flip.wav`**
  * **說明**：開啟信件、翻閱魔法書藏頭詩與十二星座對照圖之羊皮紙翻頁聲。
* **`sfx_item_pickup.wav`**
  * **說明**：拾取黃銅透鏡或日月水晶放入道具欄之清脆音效。
* **`sfx_error_shake.wav`**
  * **說明**：密碼或星座選錯時，UI 方框震動之低沉提示音。

### 8.3 第一階段：魔法書與密碼箱音效 (Stage 1 SFX)
* **`sfx_lockbox_dial.wav`**
  * **說明**：撥動 4 位數金屬密碼箱（1976）撥盤之金屬滾動聲。
* **`sfx_lockbox_open.wav`**
  * **說明**：密碼輸入 1976 正確解鎖，金屬鎖頭彈開聲。
* **`sfx_lens_toggle.wav`**
  * **說明**：點擊切換藍色魔法透鏡視角之微光開啟/關閉聲。

### 8.4 第二階段：油畫與星座機關音效 (Stage 2 SFX)
* **`sfx_constellation_click.wav`**
  * **說明**：單擊切換 3 個星座符號（♌、♋、♏）轉盤之石雕切換聲。
* **`sfx_painting_slide.wav`**
  * **說明**：星座機關解開，重型油畫向右滑開露出暗格之石牆摩擦聲。
* **`sfx_crystal_charge.wav`**
  * **說明**：油畫滑開時，日月水晶由黯淡自動轉為發光之魔法升華音。

### 8.5 第三階段：日月水晶與大門結界音效 (Stage 3 SFX)
* **`sfx_crystal_insert.wav`**
  * **說明**：將日月水晶嵌入大門中央黃銅凹槽之契合聲。
* **`sfx_switch_toggle.wav`**
  * **說明**：切換太陽開關（▲朝上/▼朝下）與月亮開關（◄朝左/►朝右）之重型開關切換聲。
* **`sfx_barrier_dispel.wav`**
  * **說明**：太陽朝上、月亮朝右設定正確時，藍紫色魔法結界消散音效。
* **`sfx_door_open.wav`**
  * **說明**：黑橡木大門開啟透光與遊戲通關勝利音效。

---

## 9. 完整素材清單與規格對照表

### 9.1 視覺圖片素材對照表 (16 張)

| 素材分類 | 檔案名稱 (`assets/`) | 建議解析度 / 比例 | 檔案格式 | 關鍵細節與備註 |
|---|---|---|---|---|
| **開場信件** | `modal_intro_letter.png` | 1920×1080 (16:9) | PNG / JPG | 泛黃羊皮紙、紅封印、手寫風、含按鈕 |
| **主場景底圖** | `bg_study.png` | 1920×1080 (16:9) | PNG / JPG | 深綠牆、胡桃木床/桌、壁爐火光、門加結界 |
| **解鎖主場景** | `bg_study_unlocked.png` | 1920×1080 (16:9) | PNG / JPG | 結界消散、大門開啟透光 |
| **魔法書封面** | `magic_book_closed.png` | 1920×1080 或 1:1 | PNG / JPG | 燙金 1976、**無日月圖騰** |
| **魔法書內頁** | `modal_magic_book_open.png` | 1920×1080 (16:9) | PNG / JPG | 含藏頭詩原文四句與日月提示 |
| **垃圾桶細節** | `trash_can_detail.png` | 1920×1080 (16:9) | PNG / JPG | 黃銅垃圾桶、揉皺紙張、露密碼箱 |
| **密碼箱介面** | `modal_lockbox.png` | 1920×1080 (16:9) | PNG / JPG | 4 位數金屬撥號盤 (密碼 1976) |
| **油畫(一般)** | `painting_stargazer_normal.png` | 1920×1080 (16:9) | PNG / JPG | 必含：**夜空、長袍、手稿** |
| **油畫(透鏡)** | `painting_stargazer_lens.png` | 1920×1080 (16:9) | PNG / JPG | 夜空=♌、長袍=♋、手稿=♏ |
| **十二星座圖** | `modal_constellation_chart.png` | 1920×1080 (16:9) | PNG / JPG | 十二宮格，連線+符號 (♈~♓) |
| **星座機關** | `modal_constellation_lock.png` | 1920×1080 (16:9) | PNG / JPG | 3個轉盤、標示「不限排列順序」 |
| **油畫暗格** | `painting_secret_compartment.png` | 1920×1080 (16:9) | PNG / JPG | 油畫右滑、露出牆面插槽 |
| **大門機關** | `modal_door_mechanism.png` | 1920×1080 (16:9) | PNG / JPG | 水晶插槽、太陽(上下)、月亮(左右) |
| **道具：透鏡** | `icon_lens.png` | 512×512 (1:1) | 去背 PNG | 黃銅單眼透鏡 (~12cm) |
| **道具：水晶(暗)** | `icon_crystal_dim.png` | 512×512 (1:1) | 去背 PNG | 左金右銀雙色，無光 |
| **道具：水晶(光)** | `icon_crystal_glowing.png` | 512×512 (1:1) | 去背 PNG | 左金右銀雙色，發光 |

### 9.2 音效與音樂素材對照表 (16 項)

| 素材分類 | 檔案名稱 (`assets/audio/`) | 音訊格式 | 觸發時機與用途說明 |
|---|---|---|---|
| **背景音樂** | `bgm_mystic_study.wav` | WAV | 主場景懸疑哥德氛圍 BGM (Loop) |
| **環境音** | `sfx_fireplace_crackle.wav` | WAV | 壁爐橘黃色火光燃燒音效 (Loop) |
| **UI 點擊** | `sfx_click_button.wav` | WAV | 信件「明白，開始逃脫！」與系統選單點擊 |
| **UI 翻頁** | `sfx_paper_flip.wav` | WAV | 閱讀信件、魔法書藏頭詩與十二星座圖 |
| **UI 拾取** | `sfx_item_pickup.wav` | WAV | 獲得黃銅透鏡或日月水晶放入道具欄 |
| **UI 錯誤** | `sfx_error_shake.wav` | WAV | 密碼箱或星座轉盤輸入錯誤震動提示 |
| **第一階段** | `sfx_lockbox_dial.wav` | WAV | 撥動 4 位數密碼箱撥盤 |
| **第一階段** | `sfx_lockbox_open.wav` | WAV | 輸入密碼 1976 成功解鎖鎖頭彈開 |
| **第一階段** | `sfx_lens_toggle.wav` | WAV | 切換藍色魔法透鏡顯影視角 |
| **第二階段** | `sfx_constellation_click.wav` | WAV | 單擊切換 3 個星座符號（♌、♋、♏）轉盤 |
| **第二階段** | `sfx_painting_slide.wav` | WAV | 星座機關解開，油畫向右滑開石牆摩擦聲 |
| **第二階段** | `sfx_crystal_charge.wav` | WAV | 水晶於暗格中自動由黯淡轉為發光 |
| **第三階段** | `sfx_crystal_insert.wav` | WAV | 將日月水晶嵌入大門中央黃銅凹槽 |
| **第三階段** | `sfx_switch_toggle.wav` | WAV | 切換太陽開關 (▲/▼) 與月亮開關 (◄/►) |
| **第三階段** | `sfx_barrier_dispel.wav` | WAV | 太陽朝上、月亮朝右正確時結界消散 |
| **第三階段** | `sfx_door_open.wav` | WAV | 黑橡木大門開啟透光與通關勝利 |
