import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
const file=resolve(process.argv[2] || '');
if(!process.argv[2])throw Error('用法：node scripts/inline-ui-report.mjs /tmp/ui-polish-musiver/home/report.html');
let html=await readFile(file,'utf8');
const match=html.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/);
if(!match)throw Error('缺少 ui-shots page 数据块');
const data=JSON.parse(match[1]);
for(const round of data.rounds)for(const shot of round.shots){
 if(shot.src.startsWith('data:'))continue;
 const image=await readFile(resolve(dirname(file),shot.src));
 shot.src=`data:image/png;base64,${image.toString('base64')}`;
}
html=html.replace(match[1],()=>JSON.stringify(data).replace(/</g,'\\u003c'));
html=html.replace('</style>','body{background:transparent} .wrap{padding-left:0;padding-right:0}</style>');
await writeFile(file,html);console.log(`已内嵌截图：${file}`);
