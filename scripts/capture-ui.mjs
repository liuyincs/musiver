import { chromium, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, relative, sep, extname } from 'node:path';
import { loadMap } from '../.agents/skills/ui-polish-musiver/scripts/ui-map.mjs';
const args = Object.fromEntries(process.argv.slice(2).reduce((a,v,i,all) => v.startsWith('--') ? [...a,[v.slice(2),all[i+1]]] : a, []));
const sizes={'web-desktop':[1440,900],'web-phone':[390,844],'web-tablet':[820,1180]};
if (!sizes[args.platform] || !args.out) throw Error('用法：pnpm ui:capture --platform web-desktop|web-phone|web-tablet --out /tmp/轮次 [--screen home] [--theme light] [--state en_default]');
const out=resolve(args.out), root=process.cwd(), build=resolve('build');
if (!relative(root,out).startsWith(`..${sep}`)) throw Error('输出目录必须在仓库外');
const map=loadMap(resolve('.agents/skills/ui-polish-musiver'));
const screens=map.screens.filter(s=>(!args.screen||s.id===args.screen)&&(!s.platforms||s.platforms.includes(args.platform)));
if(!screens.length) throw Error('没有匹配的界面');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.ico':'image/x-icon'};
const server=createServer(async(req,res)=>{try{let file=resolve(build,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(relative(build,file).startsWith('..'))throw Error();if((await stat(file)).isDirectory())file=resolve(file,'index.html');res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try{
 browser=await chromium.launch({channel:args.browser || "chrome",args:["--disable-gpu"]}); await mkdir(out,{recursive:true});
 const [width,height]=sizes[args.platform]; const manifest={platform:args.platform,logicalWidth:width,ignore:[],shots:[]};
 for(const screen of screens) for(const theme of map.config.themes.filter(t=>!args.theme||t===args.theme)) for(const state of screen.states.filter(s=>!args.state||s.id===args.state)){
  const [lang,variant]=state.id.split('_'); const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,colorScheme:theme,locale:lang==='en'?'en-US':'zh-CN',reducedMotion:'reduce'});
  await context.addInitScript(t=>localStorage.setItem('theme',t),theme);
  const page=await context.newPage(); const path=screen.id.startsWith('navigation')||screen.id==='home'?'':screen.id;
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
   await expect(page.locator('h2')).toHaveText(await buttons.nth(index).innerText());
   const data=JSON.parse(await readFile(`src/data/releases/${channel}.json`,'utf8')); const versions=channel==='stable'?(data.platforms[platform]?[data.platforms[platform]]:[]):data.platforms[platform];
   if(versions.length) await expect(page.locator('[class*="versionsList_"] > div')).toHaveCount(versions.length);
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
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));window.scrollTo(0,0);});
  await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const file=`${screen.id}-${theme}-${state.id}.png`; await page.screenshot({path:resolve(out,file),fullPage:true,animations:'disabled'});
  manifest.shots.push({screen:screen.id,theme,state:state.id,file}); await context.close();
 }
 if(!manifest.shots.length)throw Error('没有匹配的格子');
 await writeFile(resolve(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log(`${manifest.shots.length} 张截图：${out}`);
}finally{await browser?.close();await new Promise(r=>server.close(r));}
