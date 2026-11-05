# 專案致謝與授權紀錄 (CREDITS.md)

本文件紀錄《禁忌實驗室：古堡逃脫》（*Forbidden Laboratory: Castle Escape*）密室逃脫專案之團隊成員分工貢獻、2D 視覺美術素材授權，以及 16 項遊戲音效與背景音樂（BGM）之來源與授權聲明。

---

## 👥 1\. 團隊成員分工與貢獻 (Team Contributions)

* **小安 (Story, Content &amp; Assets Lead / 劇情、內容與素材負責人)**：

  * **負責檔案**：`# BRIEF.md v1`、`VERIFY.md` 及 `TESTS.md` 的「謎題與劇情」段、`content/` 文本檔、`assets/` (圖片與音效素材)、`CREDITS.md`、`PLAYTEST.md`。
  * **核心貢獻**：  
    * 主導 `# BRIEF.md v1` 故事劇本、三大階段謎題流程圖設計與 `VERIFY_puzzle_story.md` 驗收規格。
    * 撰寫 `TESTS_puzzle_story.md` 中的「劇情與謎題段」單元測試案例。
    * 抽離並維護 `content/` 資料夾中之開場信件 (`intro_letter.txt`)、藏頭詩 (`magic_book_poem.txt`) 與提示文本。
    * 製作與輸出 `assets/` 全套 16 張 2D 遊戲美術圖片（底圖、彈窗介面、機關特寫、道具去背圖），並進行邊緣去浮水印裁切處理。
    * 規劃並整理 `assets/audio/` 全套 16 項遊戲音效與背景音樂 (BGM) 素材對照清單與創用 CC 授權紀錄。
    * 主持遊戲試玩並記錄至 `PLAYTEST.md`，負責審查小雪發起的 Pull Request (PR)。
* **小星 (Frontend &amp; System Developer / 機關與網頁負責人)**：

  * **負責檔案**：`VERIFY.md` 及 `TESTS.md` 的「網頁與機關」段、`PLANS.md`、`game/` (HTML/CSS/JS 程式碼)。
  * **核心貢獻**：  
    * 依據 `VERIFY.md` 建立並維護 `PLANS.md` 任務清單與開發進度。
    * 建立 `index.html` 與 `style.css` 單頁密室逃脫網頁 UI 佈局、視角與響應式結構。
    * 撰寫 `TESTS.md` 的「網頁與機關段」測試案例，採用 TDD 模式開發 `game/` 邏輯。
    * 實作 JavaScript 4 格道具欄位管理、道具拾取與三大階段解謎機關（4位數密碼箱撥盤、魔法透鏡顯影視角切換、3轉盤星座機關、油畫暗格向右滑動、大門黃銅日月搖臂）之互動與動畫邏輯。
    * 整合 Web Audio API 系統以實現音效與背景音樂播放。
* **小雪 (QA &amp; Testing Lead / 測試與整合負責人)**：

  * **負責檔案**：`AGENTS.md`、`README.md`、`TESTS.md` 的「整合測試」段、管理 GitHub Issues 與 PR 審查。
  * **核心貢獻**：  
    * 維護 `AGENTS.md` 開發規範與 `README.md`（含遊玩說明、試玩連結、團隊分工表與 GitHub Pages 自動發布）。
    * 制定 `VERIFY.md` 全局驗收標準，撰寫 `TESTS.md` 的「整合測試段」，執行全流程端對端 (E2E) 通關測試。
    * 負責審查小安與小星發起的 Pull Request (PR)，確認品質無誤後方合併至 `main` 主分支。
    * 建立並管理 GitHub Issues 追蹤單（詳細記錄重現步驟、預期與實際結果並附截圖），指派 Bug 修復任務予責任者，維護專案測試穩定度。

---

## 🎨 2\. 視覺與美術素材授權 (Image Assets)

全套 16 張遊戲視覺素材儲存於 `assets/` 資料夾中，皆由團隊成員**小安**使用專屬 Gemini Notebook 工具構圖生成，並經由 Python 程式邊緣修剪切除浮水印後公開發表：

| 檔案名稱                              | 素材說明                  | 繪製與授權來源                        |
| --------------------------------- | --------------------- | ------------------------------ |
| `modal_intro_letter.png`          | 開場信件羊皮紙彈窗介面           | 小安原創製作 (Gemini Notebook / MIT) |
| `bg_study.png`                    | 書房主場景第一人稱底圖           | 小安原創製作 (Gemini Notebook / MIT) |
| `bg_study_unlocked.png`           | 通關結局大門開啟底圖            | 小安原創製作 (Gemini Notebook / MIT) |
| `magic_book_closed.png`           | 擺放於書桌上之燙金 1976 魔法書封面  | 小安原創製作 (Gemini Notebook / MIT) |
| `modal_magic_book_open.png`       | 魔法書內頁（藏頭詩與日月提示）彈窗     | 小安原創製作 (Gemini Notebook / MIT) |
| `trash_can_detail.png`            | 黃銅垃圾桶與紙張特寫            | 小安原創製作 (Gemini Notebook / MIT) |
| `modal_lockbox.png`               | 4 位數金屬撥號密碼箱特寫介面       | 小安原創製作 (Gemini Notebook / MIT) |
| `painting_stargazer_normal.png`   | 油畫《深夜觀星者》一般視角特寫       | 小安原創製作 (Gemini Notebook / MIT) |
| `painting_stargazer_lens.png`     | 油畫《深夜觀星者》透鏡顯影視角特寫     | 小安原創製作 (Gemini Notebook / MIT) |
| `modal_constellation_chart.png`   | 十二星座星象與符號對照圖彈窗        | 小安原創製作 (Gemini Notebook / MIT) |
| `modal_constellation_lock.png`    | 油畫下方 3 個星座轉盤機關介面      | 小安原創製作 (Gemini Notebook / MIT) |
| `painting_secret_compartment.png` | 油畫向右滑開後露出的牆壁暗格特寫      | 小安原創製作 (Gemini Notebook / MIT) |
| `modal_door_mechanism.png`        | 大門黃銅日月機關特寫介面          | 小安原創製作 (Gemini Notebook / MIT) |
| `icon_lens.png`                   | 道具：黃銅魔法透鏡 1:1 去背圖示    | 小安原創製作 (Gemini Notebook / MIT) |
| `icon_crystal_dim.png`            | 道具：日月雙色水晶（黯淡狀態）1:1 圖示 | 小安原創製作 (Gemini Notebook / MIT) |
| `icon_crystal_glowing.png`        | 道具：日月雙色水晶（發光狀態）1:1 圖示 | 小安原創製作 (Gemini Notebook / MIT) |

---

## 🎵 3\. 音效與背景音樂授權 (Audio Assets)

全套 16 項遊戲音效與背景音樂儲存於 `assets/audio/` 資料夾，採用的免費創用 CC 授權（CC0 / CC-BY）來源紀錄如下：

### 一、 背景音樂與環境音 (BGM &amp; Ambient)

1. **`bgm_mystic_study.mp3`**（古堡神秘背景音樂）

  * **來源平台**：Freesound (Sound #622155) / Pixabay Music
  * **原作者**：kevp888 / Pixabay
  * **授權協定**：CC-BY 4.0 / CC0 Free Commercial Use
2. **`sfx_fireplace_crackle.mp3`**（壁爐柴火燃燒聲）

  * **來源平台**：Freesound (Sound #370938)
  * **原作者**：jmehlferber
  * **授權協定**：CC0 (Public Domain)

### 二、 通用 UI 與介面音效 (UI &amp; General SFX)

1. **`sfx_click_button.mp3`**（按鈕點擊聲）

  * **來源平台**：Freesound (Sound #707041) / Pixabay
  * **原作者**：Vilkas\_Sound / Pixabay
  * **授權協定**：CC-BY 4.0 / CC0
2. **`sfx_paper_flip.mp3`**（羊皮紙/信件翻頁聲）

  * **來源平台**：Freesound (Sound #204046)
  * **原作者**：duckduckpony
  * **授權協定**：CC-BY 3.0
3. **`sfx_item_pickup.mp3`**（拾取道具音效）

  * **來源平台**：Freesound (Sound #416179)
  * **原作者**：InspectorJ
  * **授權協定**：CC-BY 4.0
4. **`sfx_error_shake.mp3`**（錯誤提示卡住音）

  * **來源平台**：Freesound (Sound #788792)
  * **原作者**：Geoff-Bremner-Audio
  * **授權協定**：CC-BY 4.0

### 三、 第一階段：魔法書與密碼箱音效 (Stage 1 SFX)

1. **`sfx_lockbox_dial.mp3`**（密碼箱撥盤聲）

  * **來源平台**：Freesound (Sound #342703)
  * **原作者**：SpaceJoe
  * **授權協定**：CC0 (Public Domain)
2. **`sfx_lockbox_open.mp3`**（密碼箱解鎖彈開聲）

  * **來源平台**：Freesound (Sound #408046)
  * **原作者**：170048@virtualwindow.co.za
  * **授權協定**：CC-BY 3.0
3. **`sfx_lens_toggle.mp3`**（透鏡視角切換微光聲）

  * **來源平台**：Freesound (Sound #519065)
  * **原作者**：angelkunev
  * **授權協定**：CC-BY 4.0

### 四、 第二階段：油畫與星座機關音效 (Stage 2 SFX)

1. **`sfx_constellation_click.mp3`**（星座轉盤單擊聲）

  * **來源平台**：Freesound (Sound #219553)
  * **原作者**：qubodup
  * **授權協定**：CC-BY 3.0
2. **`sfx_painting_slide.mp3`**（油畫向右滑開聲）

  * **來源平台**：Freesound (Sound #457529)
  * **原作者**：Breviceps
  * **授權協定**：CC0 (Public Domain)
3. **`sfx_crystal_charge.mp3`**（水晶自動發光魔法聲）

  * **來源平台**：Freesound
  * **原作者**：NearTheAtmosphere
  * **授權協定**：CC-BY 4.0 / CC0

### 五、 第三階段：日月水晶與大門結界音效 (Stage 3 SFX)

1. **`sfx_crystal_insert.mp3`**（水晶放入大門凹槽聲）

  * **來源平台**：Freesound (Sound #333296)
  * **原作者**：BinaryMonkFlint
  * **授權協定**：CC0 (Public Domain)
2. **`sfx_switch_toggle.mp3`**（太陽/月亮搖臂切換聲）

  * **來源平台**：Freesound (Sound #557508)
  * **原作者**：FritzSounds
  * **授權協定**：CC-BY 4.0
3. **`sfx_barrier_dispel.mp3`**（藍紫色結界消散聲）

  * **來源平台**：Freesound (Sound #833074)
  * **原作者**：ZeltBolt
  * **授權協定**：CC-BY 4.0
4. **`sfx_door_open.mp3`**（大門開啟與通關勝利音效）

  * **來源平台**：Freesound (Sound #615287)
  * **原作者**：nickrandomsounds
  * **授權協定**：CC-BY 4.0

---

*本紀錄由小安於 2026 年專案開發階段整理彙整，遵循創用 CC 協議規定。*
