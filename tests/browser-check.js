// 實際點擊畫面的驗收；不注入進度、不直接呼叫遊戲引擎。
// 先啟動 node game/serve.js，再執行 node tests/browser-check.js。
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { assets } from '../game/castle-content.js';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); }
catch { playwright = require(resolve(dirname(process.execPath), '../node_modules/playwright')); }
const output = process.env.GAME_QA_DIR ?? join(tmpdir(), 'castle-game-qa');
await mkdir(output, { recursive: true });
const browser = await playwright.chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : { channel: 'msedge' }) });
const report = { date: '2026-11-04', browser: browser.version(), reason: 'Browser plugin not available', flows: [], errors: [], screenshots: [] };
const url = 'http://127.0.0.1:4173/game/index.html';
const symbols = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
const check = (condition, message) => assert.ok(condition, message);

async function runFlow(width, height, errors, entryUrl = url) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => { if (['error','warning'].includes(message.type())) report.errors.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
  const label = `${entryUrl.startsWith('file:') ? 'direct-' : ''}${width}-${errors ? 'R-01' : 'E-01'}`;
  const shot = async name => { const path = join(output, `${label}-${name}.png`); await page.screenshot({ path, fullPage: true }); report.screenshots.push(path); };
  const click = name => page.getByRole('button', { name, exact: true }).click();
  const close = () => click('關閉調查');
  const panel = () => page.locator('#panel-content');
  const feedback = () => page.locator('#panel-message').textContent();
  const noOverflow = async () => check(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), '頁面不可水平溢出');
  const loaded = async () => {
    await page.locator('#panel-content img').evaluateAll(async images => { await Promise.all(images.map(img => img.decode())); });
    check(await page.locator('#panel-content img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0)), '調查圖片必須完整載入');
  };
  const choose = async (slot, symbol) => {
    const button = page.locator(`[data-slot="${slot}"]`);
    for (let i = 0; i < 12 && await button.locator('span').textContent() !== symbol; i++) await button.click();
    assert.equal(await button.locator('span').textContent(), symbol);
  };
  try {
    await page.goto(entryUrl);
    assert.equal(await page.title(), '禁忌實驗室：古堡逃脫');
    assert.equal(page.url(), entryUrl);
    check(await page.getByText('實驗似乎發生了意料之外的變化，書房的大門已被結界封鎖。', { exact: true }).isVisible(), '信件原文顯示');
    await shot('intro'); await noOverflow();
    await click('明白，開始逃脫！');
    await page.locator('#intro').waitFor({ state: 'hidden' });
    assert.equal(await page.locator('#inventory').innerText(), '尚未取得道具');
    await shot('room');
    if (errors) {
      await click('調查深夜觀星者'); await click('使用魔法透鏡');
      check((await feedback()).includes('需要先取得'), '沒有透鏡時不能顯影');
      assert.equal(await panel().locator('canvas').count(), 0); await close();
      await click('調查結界大門'); await click('放入日月雙色水晶');
      check((await feedback()).includes('需要先取得'), '沒有水晶時提示');
      assert.equal(await panel().locator('[data-action="sun"]').getAttribute('aria-disabled'), 'true');
      await click('確認方向，解除結界'); check((await feedback()).includes('結界仍在'), '不能提前通關'); await close();
    }
    await click('調查魔法書'); await loaded(); await shot('cover'); await click('翻開魔法書');
    for (const text of ['樂音迴響古堡間，','色彩斑斕幻影連，','桶中暗藏玄機在，','內尋方知鎖鎖牽。','日守天頂，月循右方，雙曜歸位，結界自解。']) check((await panel().textContent()).includes(text), `書本原文：${text}`);
    check(await panel().locator('.writing').evaluateAll(nodes => nodes.every(node => parseFloat(getComputedStyle(node).fontSize) >= 16)), 'M-01：書本正文在手機也至少 16px');
    await shot('book'); await noOverflow(); await close();
    await click('調查垃圾桶'); await loaded(); await click('調查桶內密碼箱'); await loaded();
    const inputBox = await page.getByRole('textbox', { name: '四位密碼' }).boundingBox();
    check(inputBox.height >= 44, 'M-02：密碼輸入至少 44px 高，手機可操作');
    if (errors) {
      for (const code of ['1234','0000','','197','19760','19 76','１９７６']) {
        await page.getByRole('textbox', { name: '四位密碼' }).fill(code); await click('開鎖');
        check((await feedback()).includes('密碼不對'), `拒絕錯密碼 ${code}`);
        assert.equal(await page.locator('#inventory').innerText(), '尚未取得道具');
      }
      await close(); await click('調查垃圾桶'); await click('調查桶內密碼箱');
    }
    await page.getByRole('textbox', { name: '四位密碼' }).fill(errors ? ' 1976 ' : '1976'); await shot('code'); await click('開鎖');
    await click('取得魔法透鏡'); await close();
    assert.equal(await page.getByRole('button', { name: '查看魔法透鏡', exact: true }).count(), 1);
    await click('查看魔法透鏡'); check((await panel().textContent()).includes('12 公分'), '透鏡描述'); await close();
    await click('調查垃圾桶'); await click('調查桶內密碼箱'); check((await panel().innerText()).includes('透鏡已取走'), '透鏡不能重取'); await close();
    await click('調查深夜觀星者'); assert.equal(await panel().locator('canvas').count(), 0);
    await click('使用魔法透鏡'); assert.equal(await panel().locator('canvas').count(), 3); await loaded(); await shot('lens');
    await click('切回一般視角'); assert.equal(await panel().locator('canvas').count(), 0); await click('使用魔法透鏡');
    await click('查看星象對照圖'); assert.equal(await panel().locator('canvas').count(), 12);
    assert.deepEqual(await panel().locator('.chart-grid b').allTextContents(), symbols);
    check(await panel().locator('.chart-grid figcaption').evaluateAll(nodes => nodes.every(node => parseFloat(getComputedStyle(node).fontSize) >= 14)), 'M-04：對照圖文字不可過小');
    await shot('chart'); await click('操作星座機關');
    for (let slot = 0; slot < 3; slot++) {
      for (let i = 0; i < 12; i++) {
        assert.equal(await page.locator(`[data-slot="${slot}"] span`).textContent(), symbols[i]);
        await page.locator(`[data-slot="${slot}"]`).click();
      }
      assert.equal(await page.locator(`[data-slot="${slot}"] span`).textContent(), '♈');
    }
    if (errors) {
      await choose(0,'♌'); await choose(1,'♌'); await choose(2,'♋'); await click('確認星座符號');
      check((await feedback()).includes('機關沒有反應'), '重複星座不開格');
      await close(); await click('調查星座機關');
      assert.equal(await page.locator('[data-slot="0"] span').textContent(),'♌');
    }
    await choose(0,'♌'); await choose(1,'♋'); await choose(2,'♏'); await shot('symbols'); await click('確認星座符號');
    await loaded(); await shot('crystal'); await page.getByRole('button', { name: '取得日月雙色水晶', exact: true }).dblclick();
    assert.equal(await panel().locator('[data-action="take-crystal"]').count(),0); await close();
    assert.equal(await page.getByRole('button', { name: '查看日月雙色水晶', exact: true }).count(),1);
    await click('查看日月雙色水晶'); check((await panel().textContent()).includes('左半部為金色、右半部為銀色'), '水晶描述'); await close();
    await click('調查魔法書'); await click('翻開魔法書'); check((await panel().textContent()).includes('日守天頂'), '取得水晶後仍能重讀'); await close();
    await click('調查結界大門');
    assert.equal(await panel().locator('[data-action="sun"]').getAttribute('aria-disabled'), 'true');
    await click('放入日月雙色水晶'); await click('水晶已嵌入插槽');
    check((await feedback()).includes('已經嵌入'), '插槽不重複放入');
    assert.equal(await page.getByRole('button', { name: '查看日月雙色水晶', exact: true }).count(),0);
    if (errors) {
      await click('確認方向，解除結界'); check((await feedback()).includes('結界仍在'), '下左不開門');
      await panel().locator('[data-action="sun"]').click(); await click('確認方向，解除結界'); check((await feedback()).includes('結界仍在'), '上左不開門');
      await panel().locator('[data-action="sun"]').click(); await panel().locator('[data-action="moon"]').click();
      await click('確認方向，解除結界'); check((await feedback()).includes('結界仍在'), '下右不開門');
      await close(); await click('調查結界大門');
      assert.equal(await panel().locator('[data-action="moon"] b').textContent(),'→ 右');
      await panel().locator('[data-action="sun"]').click();
    } else { await panel().locator('[data-action="sun"]').click(); await panel().locator('[data-action="moon"]').click(); }
    await loaded(); await shot('door');
    await page.route('**/asset/bg_study_unlocked*', async route => { await new Promise(resolve => setTimeout(resolve, 500)); await route.continue(); });
    await click('確認方向，解除結界');
    check(await page.locator('#ending').evaluate(node => node.hidden || (document.querySelector('#room-image').complete && document.querySelector('#room-image').naturalWidth > 0)), 'S-04：開門圖片尚未載入時，不先顯示成功結局');
    await page.getByRole('heading', { name: '成功逃脫', exact: true }).waitFor();
    check(await page.getByRole('heading', { name: '成功逃脫', exact: true }).isVisible(), '顯示成功逃脫');
    check((await page.locator('#room-image').getAttribute('src')).includes('unlocked'), '成功後才換開門底圖');
    check(!await page.locator('#hotspots').isVisible(), '通關後關閉舊機關');
    await shot('ending'); await noOverflow();
    await click('再玩一次'); check(await page.locator('#intro').isVisible(), '重開回到信件');
    assert.equal(await page.locator('#inventory').innerText(),'尚未取得道具');
    await click('明白，開始逃脫！'); await page.locator('#intro').waitFor({state:'hidden'});
    await click('調查結界大門'); assert.equal(await page.getByRole('button',{name:'放入日月雙色水晶',exact:true}).count(),1); await close();
    // 中途重開與取消，先取得透鏡再驗證。
    await click('調查垃圾桶'); await click('調查桶內密碼箱'); await page.getByRole('textbox',{name:'四位密碼'}).fill('1976'); await click('開鎖'); await click('取得魔法透鏡'); await close();
    await click('重新開始'); await click('繼續這一局'); assert.equal(await page.getByRole('button',{name:'查看魔法透鏡',exact:true}).count(),1);
    await click('重新開始'); await click('重新開始新遊戲'); assert.equal(await page.locator('#inventory').innerText(),'尚未取得道具');
    report.flows.push({ label, viewport: { width,height }, status: '通過', cases: 'U-01～03、I-01～04、P-01～05、S-01～06、M-01～09、E-01／R-01' });
  } catch (error) { report.flows.push({ label, status: '未通過', reason: error.message }); await shot('failure'); throw error; }
  finally { await page.close(); }
}

async function checkAssetsMotionAndLoadFailure() {
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, reducedMotion: 'no-preference' });
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => { if (['error','warning'].includes(message.type())) report.errors.push(message.text()); });
  const click = name => page.getByRole('button', { name, exact: true }).click();
  try {
    await page.goto('http://127.0.0.1:4173/');
    assert.equal(page.url(), url, '根網址應轉到正式入口，避免相對路徑缺檔');
    const sizes = await page.evaluate(async sources => Promise.all(sources.map(source => new Promise((resolve,reject) => {
      const img = new Image(); img.onload = () => resolve([img.naturalWidth,img.naturalHeight]); img.onerror = () => reject(new Error(source)); img.src = `/${source}`;
    }))), Object.values(assets));
    assert.equal(sizes.length,16); check(sizes.every(([w,h]) => w > 0 && h > 0), '16 張素材全部可解碼');
    await click('明白，開始逃脫！'); await page.locator('#intro').waitFor({state:'hidden'});
    await page.keyboard.press('Enter'); check(await page.locator('#investigation').isVisible(), 'Enter 可調查焦點物件');
    await page.keyboard.press('Escape'); check(!await page.locator('#investigation').isVisible(), 'Esc 可返回');
    await click('調查垃圾桶'); await click('調查桶內密碼箱'); await page.getByRole('textbox',{name:'四位密碼'}).fill('1976'); await click('開鎖'); await click('取得魔法透鏡'); await click('關閉調查');
    await page.setViewportSize({width:800,height:700}); await click('調查魔法書'); await click('翻開魔法書');
    check((await page.locator('#panel-content').textContent()).includes('內尋方知鎖鎖牽。'), '縮放後書本可讀與可點'); await click('關閉調查');
    check(await page.getByRole('button',{name:'查看魔法透鏡',exact:true}).isVisible(), '縮放後道具保留');
    await page.setViewportSize({width:1366,height:900});
    await click('調查深夜觀星者'); await click('使用魔法透鏡'); await click('操作星座機關');
    for (const [slot,times] of [[0,4],[1,3],[2,7]]) for (let i=0;i<times;i++) await page.locator(`[data-slot="${slot}"]`).click();
    await click('確認星座符號');
    const initial = await page.locator('.crystal-lit').evaluate(node => ({opacity: Number(getComputedStyle(node).opacity),animation:getComputedStyle(node).animationName}));
    assert.equal(initial.animation,'light-up'); check(initial.opacity < 1, '一般模式水晶不是立即全亮');
    const bounds = await page.locator('.crystal-sprite').evaluateAll(nodes => nodes.map(node => { const r=node.getBoundingClientRect(); return [r.x,r.y,r.width,r.height]; }));
    assert.deepEqual(bounds[0],bounds[1], '暗亮兩狀態位置與大小一致');
    const darkPath = join(output,'motion-opening.png'); await page.screenshot({path:darkPath,fullPage:true}); report.screenshots.push(darkPath);
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('.crystal-lit')).opacity) === 1);
    const transform = await page.locator('.sliding-painting').evaluate(node => new DOMMatrix(getComputedStyle(node).transform).m41);
    check(transform > 900, '油畫確實向右滑出');
    const litPath = join(output,'motion-crystal-lit.png'); await page.screenshot({path:litPath,fullPage:true}); report.screenshots.push(litPath);
    await click('取得日月雙色水晶'); await click('關閉調查'); await click('調查結界大門'); await click('放入日月雙色水晶');
    await page.locator('[data-action="sun"]').click(); await page.locator('[data-action="moon"]').click(); await click('確認方向，解除結界');
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('#scene'),'::after').opacity) === 0);
    check(await page.getByRole('heading',{name:'成功逃脫',exact:true}).isVisible(), '一般動畫結束能通關');
    report.flows.push({label:'M-06～09、U-02～03、T-03',status:'通過',details:'16 張圖片解碼、鍵盤、800×700 縮放、正常動畫右移、水晶同位置暗轉亮、結界消散'});
  } finally { await page.close(); }
  // 獨立的損壞資料案例；不改正式檔案或通關局的遊戲狀態。
  const broken = await browser.newPage();
  try {
    await broken.route('**/castle-content.js', async route => { const response = await route.fetch(); await route.fulfill({response,body:`${await response.text()}\ncastleContent.room.title = '';`}); });
    await broken.goto(url);
    await broken.getByText('遊戲內容載入失敗，請重新載入或檢查遊戲檔案。',{exact:true}).waitFor();
    check(!await broken.locator('#intro').isVisible(), '損壞資料不得進入遊戲');
    report.flows.push({label:'D-10',status:'通過',details:'隔離的損壞資料顯示載入失敗，停止進入遊戲'});
  } finally { await broken.close(); }
}

try {
  const directUrl = new URL('../game/index.html', import.meta.url).href;
  await runFlow(1366, 900, true, directUrl);
  await runFlow(390, 844, false, directUrl);
  await checkAssetsMotionAndLoadFailure();
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(url);
  assert.equal(await mobile.locator('.mobile-objects button').count(), 6, 'U-02：手機提供六個容易點擊的文字入口');
  check(await mobile.locator('.mobile-objects button').evaluateAll(buttons => buttons.every(button => button.getBoundingClientRect().height >= 44)), '手機入口至少 44px 高');
  await mobile.close();
  // 手機先跑，能及早抓到文字與控制大小不足。
  await runFlow(390, 844, true);
  await runFlow(1366, 900, false);
  assert.deepEqual(report.errors, [], '不得有瀏覽器錯誤、警告或缺圖');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile(join(output, 'browser-results.json'), JSON.stringify(report, null, 2));
  await browser.close();
}
