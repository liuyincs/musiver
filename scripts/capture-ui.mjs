import { chromium, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import { resolve, relative, sep, extname, join } from 'node:path';
import { loadMap } from '../.agents/skills/ui-polish-musiver/scripts/ui-map.mjs';
const args = Object.fromEntries(process.argv.slice(2).reduce((a,v,i,all) => v.startsWith('--') ? [...a,[v.slice(2),all[i+1]]] : a, []));
const sizes={'web-desktop':[1440,900],'web-phone':[390,844],'web-tablet':[820,1180]};
if (!sizes[args.platform] || !args.out) throw Error('用法：pnpm ui:capture --platform web-desktop|web-phone|web-tablet --out /tmp/轮次 [--screen home] [--screens home,download] [--theme light] [--state en_default]');
const out=resolve(args.out), root=process.cwd(), build=resolve('build');
if (!relative(root,out).startsWith(`..${sep}`)) throw Error('输出目录必须在仓库外');
const map=loadMap(resolve('.agents/skills/ui-polish-musiver'));
const wanted=args.screens?args.screens.split(','):args.screen?[args.screen]:null;
const screens=map.screens.filter(s=>(!wanted||wanted.includes(s.id))&&(!s.platforms||s.platforms.includes(args.platform)));
if(!screens.length) throw Error('没有匹配的界面');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.ico':'image/x-icon'};
const server=createServer(async(req,res)=>{try{let file=resolve(build,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(relative(build,file).startsWith('..'))throw Error();if((await stat(file)).isDirectory())file=resolve(file,'index.html');res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
// 字体来自 Google Fonts，走网络每次拿到的字节、送达时机都可能有差，同一构建连拍会出现只差字形
// 抗锯齿几级灰度的画面。第一次抓到本地，之后一律从本地回放，画面的输入就固定了。
const fontCache=process.env.UI_SHOTS_FONT_CACHE||join(homedir(),'.cache','musiver-ui-shots','fonts');
const cachedFont=async(route)=>{
 const url=route.request().url();
 const key=createHash('sha1').update(url).digest('hex');
 const body=join(fontCache,key), meta=`${body}.response.json`;
 if(existsSync(body)&&existsSync(meta)){
  const response=JSON.parse(readFileSync(meta,'utf8'));
  return route.fulfill({ status: response.status, headers: response.headers, body: readFileSync(body) });
 }
 const response=await route.fetch();
 const bytes=await response.body();
 mkdirSync(fontCache,{recursive:true});
 writeFileSync(body,bytes); writeFileSync(meta,JSON.stringify({ status: response.status(), headers: response.headers() },null,2));
 return route.fulfill({ status: response.status(), headers: response.headers(), body: bytes });
};
let browser;
try{
 browser=await chromium.launch({channel:args.browser || "chrome",args:["--disable-gpu","--disable-partial-raster","--num-raster-threads=1"]}); await mkdir(out,{recursive:true});
 const [width,height]=sizes[args.platform]; const manifest={platform:args.platform,logicalWidth:width,ignore:[],shots:[]};
 for(const screen of screens) for(const theme of map.config.themes.filter(t=>!args.theme||t===args.theme)) for(const state of screen.states.filter(s=>!args.state||s.id===args.state)){
  const [lang,variant]=state.id.split('_'); const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,colorScheme:theme,locale:lang==='en'?'en-US':'zh-CN',reducedMotion:'reduce'});
  await context.addInitScript(t=>localStorage.setItem('theme',t),theme);
  // 动画、过渡、光标闪烁都在首次绘制前关掉：加载后再注入的话，已经画过的部分不会被重绘，
  // 同一页里新旧两种状态并存，同一构建连拍就对不上。
  await context.addInitScript(css=>{const apply=()=>{const s=document.createElement('style');s.textContent=css;document.documentElement.appendChild(s);};if(document.documentElement)apply();else new MutationObserver((_,o)=>{if(document.documentElement){o.disconnect();apply();}}).observe(document,{childList:true});},'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}');
  const page=await context.newPage(); const path=screen.id.startsWith('navigation')||screen.id==='home'?'':screen.id;
  await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, cachedFont);
  await page.goto(`http://127.0.0.1:${server.address().port}/${lang==='en'?'':'zh-Hans/'}${path}`,{waitUntil:'networkidle'});
  await expect(page.locator('html')).toHaveAttribute('data-has-hydrated','true');
  await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
  await expect(page.locator('html')).toHaveAttribute('lang',lang);
  await expect(page.locator('h1')).toBeVisible();
  if(screen.id==='download'){
   const [channel,platform]=variant.split('-'); const index=['android','harmony','apple','windows','linux','web'].indexOf(platform);
   const buttons=page.locator('button[class*="platformBtn"]'); await buttons.nth(index).click();
   await expect(buttons.nth(index)).toHaveClass(/platformBtnActive/);
   const toggle=page.locator('button[class*="toggleBtn"]').nth(channel==='stable'?0:1); await toggle.click(); await expect(toggle).toHaveClass(/toggleBtnActive/);
   await expect(page.locator('[class*="cardTitle_"]')).toHaveText(await buttons.nth(index).innerText());
   const data=JSON.parse(await readFile(`src/data/releases/${channel}.json`,'utf8')); const versions=channel==='stable'?(data.platforms[platform]?[data.platforms[platform]]:[]):data.platforms[platform];
   if(versions.length) {
    const list=page.locator('[class*="versionsList_"]');
    await expect(list.locator(':scope > div')).toHaveCount(versions.length);
    if(channel==='beta'&&platform==='apple') {
     const copy=JSON.parse(await readFile(`i18n/${lang}/code.json`,'utf8'));
     const apply=list.getByRole('button',{name:copy['download.testflight.apply'].message,exact:true});
     const dialog=page.getByRole('dialog',{name:copy['download.testflight.title'].message});
     await expect(apply).toHaveCount(versions.length);
     await expect(list.locator('a')).toHaveCount(0);
     await expect(dialog).toBeHidden();
     await apply.first().press('Enter');
     await expect(dialog).toBeVisible();
     await expect(dialog.getByRole('listitem')).toHaveText(['receipt','account','server'].map(key=>copy[`download.testflight.${key}`].message));
     await expect(dialog.getByRole('link')).toHaveAttribute('href',`mailto:support@musiver.cn?subject=${encodeURIComponent(copy['download.testflight.subject'].message)}`);
     await page.keyboard.press('Escape');
     await expect(dialog).toBeHidden();
     await expect(apply.first()).toBeFocused();
     const last=apply.last();
     await last.click();
     await dialog.getByRole('button',{name:copy['download.testflight.close'].message,exact:true}).click();
     await expect(dialog).toBeHidden();
     await expect(last).toBeFocused();
     if(variant==='beta-apple-application') {
      await apply.first().click();
      await expect(dialog).toBeVisible();
     }
    } else {
     await expect(list.locator('button:disabled')).toHaveCount(versions.filter(v=>!v.downloadUrl.trim()).length);
     await expect(list.locator('a[class*="downloadBtn_"]')).toHaveCount(versions.filter(v=>v.downloadUrl.trim()).length);
    }
   }
   else await expect(page.locator('[class*="downloadCard_"]')).toContainText(lang==='en'?'No release available':'暂无');
  }
  if(screen.id.startsWith('navigation')){
   if(variant.startsWith('menu')){ await page.locator('.navbar__toggle').click(); await expect(page.locator('.navbar-sidebar')).toBeVisible(); }
   if(variant.includes('locale')){
    const scope=variant==='menu-locale'?page.locator('.navbar-sidebar'):page.locator('.navbar__items--right');
    await scope.locator(variant==='menu-locale'?'.menu__link--sublist':'.navbar__link').filter({hasText:variant==='menu-locale'?(lang==='en'?'Languages':'语言'):(lang==='en'?'English':'简体中文')}).first().click();
    await expect(scope.getByText(lang==='en'?'简体中文':'English',{exact:true}).last()).toBeVisible();
   }
  }
  // 字体来自 Google Fonts：每张 @font-face（含各 unicode-range 子集）都等到加载完再截图。少一张，
  // 用到它的字会先画成回退字形、加载完再重画，而重画发生在首帧之后，同一构建连拍就对不上。
  // 拿不到字体就报错退出，不输出图片。
  await page.evaluate(async()=>{
    await Promise.allSettled([...document.fonts].map(f=>f.load()));
    await document.fonts.ready;
    await Promise.all([...document.images].map(i=>i.decode()));
    window.scrollTo(0,0);
  });
  const fontState=await page.evaluate(()=>{
    const faces=[...document.fonts];
    return { total: faces.length, bad: faces.filter(f=>f.status!=='loaded').map(f=>`${f.family} ${f.weight} ${f.style}（${f.status}）`) };
  });
  if(!fontState.total||fontState.bad.length)throw Error(`${screen.id}/${theme}/${state.id} 字体没有就位：${[...new Set(fontState.bad)].join('、')||'没有声明任何字体'}`);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const file=`${screen.id}-${theme}-${state.id}.png`; await page.screenshot({path:resolve(out,file),fullPage:variant!=='beta-apple-application',animations:'disabled'});
  manifest.shots.push({screen:screen.id,theme,state:state.id,file}); await context.close();
 }
 if(!manifest.shots.length)throw Error('没有匹配的格子');
 await writeFile(resolve(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log(`${manifest.shots.length} 张截图：${out}`);
}finally{await browser?.close();await new Promise(r=>server.close(r));}
