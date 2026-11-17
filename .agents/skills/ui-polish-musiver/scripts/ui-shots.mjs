#!/usr/bin/env node
// 截图轮次：校验一轮截图的清单，按主题拼图送审，生成评审提示词，沿用画面没变的格子的分数，
// 合并评审结果，把前后截图和过程记录做成网页。
//
// 用法：node ui-shots.mjs <命令> [选项]，--help 查看全部命令。
// 地图目录默认是本脚本所在技能目录（scripts/ 的上一级），可用 --dir 覆盖。

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { inflateSync } from "node:zlib";
import { cells, familyOf, loadMap, parseArgs, platformsOf, validate } from "./ui-map.mjs";

const USAGE = `用法：node ui-shots.mjs <命令> [选项]

命令：
  compare <轮次目录> <轮次目录>  逐格比较两轮的画面哈希（跳过 manifest 的 ignore 区域）；
                                  同一构建连拍两轮全部一致，截图才算稳定
  verify <轮次目录>               校验 manifest.json：每个出现的界面在本平台上的格子是否截全、
                                  文件能否读取、不同状态是否截成了同一张图
  prepare <轮次目录> [--prev <上一轮目录>] [--fresh] [--ref <参照轮次目录>]
                                  先做 verify，再按「界面 × 状态」拼图（同一张图里放各主题），
                                  画面没变的格子沿用上一轮或地图里的分数，写 plan.json 和评审提示词 prompt.md；
                                  送审界面在蓝图里还没有「打磨范围」时是定调轮，否则是打磨轮
  merge <轮次目录> [--review <评审结果.json>]
                                  把评审结果和沿用的分数合成 scores.json（供 ui-map record --from 使用），
                                  把修改建议、方向性建议和打磨范围草案编号写进 suggestions.json
  page <轮次目录>... --out <网页.html> [--title 标题]
                                  按轮次顺序把截图、分数、修改建议和 changes.json 做成一个网页：
                                  第一轮和最后一轮前后对比，点图放大

通用选项：
  --dir <技能目录>                默认是本脚本的上一级目录`;

const ASSETS = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
const asset = (name) => readFileSync(join(ASSETS, name), "utf8");

// 多数模型把长边超过约 1568px 的图片先缩小再读，拼图的长边不超过它，每格的像素才不会被二次压缩。
export const MAX_EDGE = 1568;
export const LABEL = 32;
const FONTS = [
  "/System/Library/Fonts/Supplemental/Arial.ttf",
  "/System/Library/Fonts/Helvetica.ttc",
  "C:/Windows/Fonts/arial.ttf",
  "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
  "/usr/share/fonts/dejavu/DejaVuSans.ttf",
];

const CHANNELS = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

// 还原 PNG 的逐行滤波，得到原始像素字节；同样的像素换一种滤波或压缩方式编码，结果也相同。
function pngPixels(file, ihdr, data) {
  const width = ihdr.readUInt32BE(0);
  const height = ihdr.readUInt32BE(4);
  const channels = CHANNELS[ihdr[9]];
  if (!channels) throw new Error(`${file}：不认识的 PNG 颜色类型 ${ihdr[9]}`);
  if (ihdr[12]) throw new Error(`${file}：不支持隔行扫描的 PNG，截图工具改存普通 PNG`);
  const bitsPerPixel = channels * ihdr[8];
  const bpp = Math.max(1, bitsPerPixel >> 3);
  const stride = Math.ceil((width * bitsPerPixel) / 8);
  const pixels = Buffer.alloc(stride * height);
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const filter = data[y * (stride + 1)];
    const line = data.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const cur = pixels.subarray(y * stride, (y + 1) * stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0;
      const b = prev[i];
      const c = i >= bpp ? prev[i - bpp] : 0;
      let pred = 0;
      if (filter === 1) pred = a;
      else if (filter === 2) pred = b;
      else if (filter === 3) pred = (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        pred = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      } else if (filter !== 0) throw new Error(`${file}：PNG 第 ${y} 行的滤波类型 ${filter} 无效`);
      cur[i] = (line[i] + pred) & 0xff;
    }
    prev = cur;
  }
  return { width, height, stride, bitsPerPixel, pixels };
}

// 把易变区域清零后再算哈希。区域单位是图片像素，省略 x / y 从 0 开始，省略 width / height 延伸到图片边缘。
function blankRegions(img, regions) {
  for (const r of regions) {
    const x0 = Math.max(0, r.x ?? 0);
    const y0 = Math.max(0, r.y ?? 0);
    const x1 = Math.min(img.width, r.width === undefined ? img.width : x0 + r.width);
    const y1 = Math.min(img.height, r.height === undefined ? img.height : y0 + r.height);
    const b0 = Math.floor((x0 * img.bitsPerPixel) / 8);
    const b1 = Math.ceil((x1 * img.bitsPerPixel) / 8);
    for (let y = y0; y < y1; y++) img.pixels.fill(0, y * img.stride + b0, y * img.stride + b1);
  }
}

// 画面哈希：PNG 取尺寸、调色板和还原后的像素，忽略时间戳等附加块，ignore 里的区域不计；其他格式取文件字节。
export function readImage(file, ignore = []) {
  const buf = readFileSync(file);
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    let ihdr = null;
    let plte = Buffer.alloc(0);
    const idat = [];
    for (let i = 8; i + 8 <= buf.length;) {
      const len = buf.readUInt32BE(i);
      const type = buf.toString("ascii", i + 4, i + 8);
      const data = buf.subarray(i + 8, i + 8 + len);
      if (type === "IHDR") ihdr = data;
      if (type === "PLTE") plte = data;
      if (type === "IDAT") idat.push(data);
      i += 12 + len;
    }
    if (!ihdr || !idat.length) throw new Error(`${file} 不是完整的 PNG`);
    const img = pngPixels(file, ihdr, inflateSync(Buffer.concat(idat)));
    blankRegions(img, ignore);
    const hash = createHash("sha256").update(ihdr.subarray(0, 13)).update(plte).update(img.pixels).digest("hex");
    return { width: img.width, height: img.height, hash };
  }
  if (ignore.length) throw new Error(`${file}：manifest 给了 ignore 区域，这只支持 PNG，截图工具改存 PNG`);
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    for (let i = 2; i + 9 < buf.length;) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5), hash: createHash("sha256").update(buf).digest("hex") };
      }
      i += 2 + len;
    }
    throw new Error(`${file} 是 JPEG，但读不到尺寸`);
  }
  throw new Error(`${file} 不是 PNG 或 JPEG`);
}

export function loadRound(dir) {
  const file = join(dir, "manifest.json");
  if (!existsSync(file)) throw new Error(`找不到 ${file}，截图工具要在轮次目录里写 manifest.json`);
  const m = JSON.parse(readFileSync(file, "utf8"));
  if (!m.platform || !Array.isArray(m.shots) || !m.shots.length) throw new Error(`${file} 需要 platform 和非空的 shots`);
  const shots = m.shots.map((s) => {
    if (!s.screen || !s.theme || !s.state || !s.file) throw new Error(`${file}：每条 shot 需要 screen、theme、state、file`);
    const path = isAbsolute(s.file) ? s.file : resolve(dir, s.file);
    if (!existsSync(path)) throw new Error(`${file}：找不到图片 ${path}`);
    return { ...s, path, logicalWidth: s.logicalWidth ?? m.logicalWidth, ...readImage(path, [...(m.ignore ?? []), ...(s.ignore ?? [])]) };
  });
  return { dir: resolve(dir), platform: m.platform, shots };
}

const key = (c) => `${c.screen}/${c.theme}/${c.state}`;

export function verifyRound(map, round) {
  const errors = validate(map);
  const { config } = map;
  const { platform, shots } = round;
  if (!config.platforms.includes(platform)) errors.push(`manifest 的平台 ${platform} 不在 config.platforms 中`);
  const seen = new Map();
  for (const s of shots) {
    const screen = map.screens.find((x) => x.id === s.screen);
    if (!screen) { errors.push(`${key(s)}：地图里没有界面 ${s.screen}`); continue; }
    if (!platformsOf(screen, config).includes(platform)) errors.push(`${key(s)}：${s.screen} 不支持平台 ${platform}`);
    if (!(screen.themes ?? config.themes).includes(s.theme)) errors.push(`${key(s)}：${s.screen} 没有主题 ${s.theme}`);
    const state = screen.states.find((x) => x.id === s.state);
    if (!state) errors.push(`${key(s)}：${s.screen} 没有状态 ${s.state}`);
    else if (state.gaps?.[platform]) errors.push(`${key(s)}：已经截到了，先删掉这个状态在 ${platform} 上的 gaps 条目`);
    if (seen.has(key(s))) errors.push(`${key(s)}：manifest 里出现了两次`);
    seen.set(key(s), s);
  }
  for (const id of new Set(shots.map((s) => s.screen))) {
    const screen = map.screens.find((x) => x.id === id);
    if (!screen) continue;
    for (const c of cells(screen, config, () => [], [platform])) {
      if (c.status !== "gap" && !seen.has(key({ screen: id, ...c }))) errors.push(`${id}/${c.theme}/${c.state}：缺截图`);
    }
  }
  const byHash = new Map();
  for (const s of shots) {
    const k = `${s.screen}/${s.theme}/${s.hash}`;
    byHash.set(k, [...(byHash.get(k) ?? []), s.state]);
  }
  for (const [k, states] of byHash) {
    if (states.length > 1) errors.push(`${k.split("/").slice(0, 2).join("/")}：状态 ${states.join("、")} 的画面完全相同，截图前没有进入对应状态`);
  }
  return errors;
}

const even = (n) => Math.max(2, Math.round(n / 2) * 2);

// 一张拼图 = 一个界面的一个状态，各主题从左到右排开；每格不小于逻辑宽度，拼图长边不超过 MAX_EDGE。
export function layout(round, themes) {
  const groups = new Map();
  for (const s of round.shots) {
    const k = `${s.screen}--${s.state}`;
    groups.set(k, [...(groups.get(k) ?? []), s]);
  }
  const sheets = [];
  for (const [id, shots] of groups) {
    const tiles = shots
      .sort((a, b) => themes.indexOf(a.theme) - themes.indexOf(b.theme))
      .map((s) => {
        const tileWidth = even(Math.min(s.width, s.logicalWidth ?? s.width));
        return { ...s, label: `${s.screen} / ${s.theme} / ${s.state}`, tileWidth, tileHeight: even((s.height * tileWidth) / s.width) };
      });
    const tall = tiles.filter((t) => t.tileHeight + LABEL > MAX_EDGE || t.tileWidth > MAX_EDGE);
    for (const t of tall) sheets.push({ id: `${id}--${t.theme}`, standalone: true, tiles: [t] });
    const rest = tiles.filter((t) => !tall.includes(t));
    if (!rest.length) continue;
    const perSheet = Math.max(1, Math.floor(MAX_EDGE / Math.max(...rest.map((t) => t.tileWidth))));
    const chunks = [];
    for (let i = 0; i < rest.length; i += perSheet) chunks.push(rest.slice(i, i + perSheet));
    chunks.forEach((c, i) => sheets.push({ id: chunks.length > 1 ? `${id}--${i + 1}` : id, standalone: false, tiles: c }));
  }
  return sheets;
}

// 画面哈希相同就沿用分数：先找上一轮，再找地图；被 invalidate 标记的分数不沿用，--fresh 时一律重评。
export function attachCarry(sheets, { platform, map, prev, fresh }) {
  for (const sheet of sheets) {
    for (const t of sheet.tiles) {
      if (fresh) continue;
      const fromPrev = prev?.find((p) => p.platform === platform && key(p) === key(t) && p.shot === t.hash);
      if (fromPrev) { t.carry = { score: fromPrev.score, deductions: fromPrev.deductions ?? [], from: "上一轮" }; continue; }
      const screen = map.screens.find((s) => s.id === t.screen);
      const recorded = screen?.scores?.find((x) => x.platform === platform && x.theme === t.theme && x.state === t.state);
      if (recorded?.shot === t.hash && !recorded.invalidated) {
        t.carry = { score: recorded.score, deductions: recorded.deductions ?? [], from: `地图 ${recorded.commit.slice(0, 8)}` };
      }
    }
    sheet.review = sheet.tiles.some((t) => !t.carry);
  }
  return sheets;
}

const escFilter = (v) => `'${String(v).replace(/\\/g, "/").replace(/'/g, "").replace(/:/g, "\\:")}'`;

export function ffmpegArgs(sheet, out, font) {
  const height = Math.max(...sheet.tiles.map((t) => t.tileHeight)) + LABEL;
  const parts = sheet.tiles.map((t, i) => [
    `[${i}:v]scale=${t.tileWidth}:${t.tileHeight}`,
    `pad=${t.tileWidth}:${height}:0:${LABEL}:color=0x202020`,
    `drawtext=${font ? `fontfile=${escFilter(font)}:` : ""}expansion=none:text=${escFilter(t.label)}:x=8:y=8:fontsize=18:fontcolor=white[t${i}]`,
  ].join(","));
  const n = sheet.tiles.length;
  const filter = n > 1 ? `${parts.join(";")};${sheet.tiles.map((_, i) => `[t${i}]`).join("")}hstack=inputs=${n}[out]` : parts[0];
  return ["-hide_banner", "-loglevel", "error", "-y", ...sheet.tiles.flatMap((t) => ["-i", t.path]),
    "-filter_complex", filter, "-map", n > 1 ? "[out]" : "[t0]", "-frames:v", "1", "-update", "1", "-q:v", "3", out];
}

export function magickArgs(sheet, out) {
  const height = Math.max(...sheet.tiles.map((t) => t.tileHeight)) + LABEL;
  return [...sheet.tiles.flatMap((t) => ["(", t.path, "-resize", `${t.tileWidth}x${t.tileHeight}!`, "-background", "#202020",
    "-gravity", "North", "-splice", `0x${LABEL}`, "-fill", "white", "-pointsize", "18", "-annotate", "+0+7", t.label,
    "-extent", `${t.tileWidth}x${height}`, ")"]), "-background", "#202020", "+append", "-quality", "85", out];
}

const has = (cmd) => { try { execFileSync(cmd, ["-version"], { stdio: "ignore" }); return true; } catch { return false; } };

export function defaultBuild() {
  let tool;
  return (sheet, out) => {
    tool ??= has("magick") ? "magick" : has("ffmpeg") ? "ffmpeg" : null;
    if (!tool) throw new Error("拼图需要 ImageMagick（magick）或 ffmpeg，先在本机装好其中一个");
    if (tool === "magick") execFileSync("magick", magickArgs(sheet, out), { stdio: ["ignore", "ignore", "pipe"] });
    else {
      const font = process.env.UI_SHOTS_FONT ?? FONTS.find((f) => existsSync(f));
      execFileSync("ffmpeg", ffmpegArgs(sheet, out, font), { stdio: ["ignore", "ignore", "pipe"] });
    }
  };
}

const readJson = (file, hint) => {
  if (!existsSync(file)) throw new Error(`找不到 ${file}${hint ? `，${hint}` : ""}`);
  return JSON.parse(readFileSync(file, "utf8"));
};

function formatDeduction(d) {
  if (typeof d === "string") return d;
  const where = d.where ? `（${d.where}）` : "";
  const pref = d.kind && d.kind !== "真实问题" ? `［${d.kind}］` : "";
  return `${d.element ?? ""}${where} -${d.points}${pref}`;
}

export function mergeReview(plan, review) {
  const errors = [];
  const out = [];
  const notes = [];
  for (const sheet of plan.sheets) {
    for (const t of sheet.tiles) {
      const base = { screen: t.screen, platform: plan.platform, theme: t.theme, state: t.state, shot: t.hash };
      if (!sheet.review) { out.push({ ...base, score: t.carry.score, deductions: t.carry.deductions }); continue; }
      const cell = review?.cells?.find((c) => key(c) === key(t));
      if (!cell) { errors.push(`${key(t)}：评审结果里没有这一格（图片 ${sheet.id}）`); continue; }
      const dims = Object.values(cell.dimensions ?? {});
      const sum = dims.length ? Math.round(dims.reduce((a, b) => a + b, 0) * 10) / 10 : null;
      const score = sum ?? cell.total;
      if (typeof score !== "number") { errors.push(`${key(t)}：没有分数`); continue; }
      if (sum !== null && typeof cell.total === "number" && Math.abs(sum - cell.total) > 0.05) notes.push(`${key(t)}：评审员的总分 ${cell.total} 与各维度之和 ${sum} 不一致，按维度之和记录`);
      for (const d of cell.deductions ?? []) if (typeof d !== "object" || !d.suggestion) errors.push(`${key(t)}：扣分点「${d?.element ?? d}」没有修改建议`);
      const deductions = [...(cell.deductions ?? [])].sort((a, b) => (b.points ?? 0) - (a.points ?? 0)).slice(0, 5).map(formatDeduction);
      out.push({ ...base, score, deductions });
    }
  }
  if (plan.mode === "calibrate") {
    for (const id of plan.pending ?? []) {
      const s = review?.scope?.find((x) => x.screen === id);
      if (!s?.locked?.length || !s?.adjustable?.length) errors.push(`${id}：定调轮的评审结果里没有这个界面的打磨范围草案（scope 的 locked 和 adjustable 都不能为空）`);
    }
  }
  return { errors, scores: out, notes };
}

// 编号后的修改建议（S）、与蓝图不一致（M）、方向性建议（D）：代理逐条在 changes.json 里写明采纳或不采纳。
export function collectSuggestions(plan, review) {
  const suggestions = (review?.cells ?? []).flatMap((c) => (c.deductions ?? []).map((d) => ({
    screen: c.screen, theme: c.theme, state: c.state, element: d.element, where: d.where, points: d.points, kind: d.kind, suggestion: d.suggestion,
  }))).map((s, i) => ({ id: `S${i + 1}`, ...s }));
  const number = (list, p) => (list ?? []).map((x, i) => ({ id: `${p}${i + 1}`, ...(typeof x === "string" ? { text: x } : x) }));
  return {
    mode: plan.mode ?? null, suggestions, mismatches: number(review?.blueprintMismatches, "M"), directions: number(review?.directions, "D"),
    ...(plan.mode === "calibrate" ? { scope: review?.scope ?? [] } : {}),
  };
}

// 蓝图按二级标题切节，标题里的半角冒号统一成全角。
export function blueprintSections(md) {
  const out = new Map();
  let cur = null;
  for (const line of md.split("\n")) {
    const m = /^## (.+?)\s*$/.exec(line);
    if (m) { cur = m[1].replace(":", "："); out.set(cur, [line]); } else if (cur) out.get(cur).push(line);
  }
  return new Map([...out].map(([k, v]) => [k, v.join("\n").trim()]));
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const hasScope = (layout, id) => new RegExp(`^### 打磨范围[：:]\\s*${escapeRe(id)}\\s*$`, "m").test(layout);

// 送审界面涉及的蓝图（共通 + 本族布局）和还没有打磨范围的界面；有一个界面没有范围，整轮就是定调轮。
export function reviewContext(map, platform, ids) {
  const family = familyOf(map.config, platform);
  const parts = new Map();
  const pending = [];
  for (const id of ids) {
    const screen = map.screens.find((s) => s.id === id);
    if (!screen?.blueprint) throw new Error(`${id}：地图里没有指定 blueprint，先补上再送审`);
    const file = join(map.dir, "blueprints", `${screen.blueprint}.md`);
    if (!existsSync(file)) throw new Error(`${id}：找不到蓝图 ${file}`);
    const sec = blueprintSections(readFileSync(file, "utf8"));
    const common = sec.get("共通");
    const layout = sec.get(`布局：${family}`);
    if (!common || !layout) throw new Error(`${file} 缺少「## 共通」或「## 布局：${family}」一节`);
    parts.set(screen.blueprint, `【蓝图 ${screen.blueprint}】\n\n${common}\n\n${layout}`);
    if (!hasScope(layout, id)) pending.push(id);
  }
  return { family, pending, blueprint: [...parts.values()].join("\n\n") };
}

export function fillPrompt(template, values) {
  return template.replace(/\[\[([^\]]+)\]\]/g, (m, k) => {
    if (!(k in values)) throw new Error(`提示词模板里有未知占位 ${m}`);
    return values[k];
  });
}

function buildPrompt(map, round, plan, refDir) {
  const review = plan.sheets.filter((s) => s.review);
  const tiles = review.flatMap((s) => s.tiles);
  const ids = [...new Set(tiles.map((t) => t.screen))];
  const ctx = reviewContext(map, round.platform, ids);
  const rubric = join(map.dir, "rubric.md");
  if (!existsSync(rubric)) throw new Error(`找不到 ${rubric}`);
  const describe = ids.map((id) => {
    const screen = map.screens.find((s) => s.id === id);
    const states = [...new Set(tiles.filter((t) => t.screen === id).map((t) => t.state))]
      .map((st) => { const name = screen.states.find((x) => x.id === st)?.name; return name ? `${st}（${name}）` : st; });
    return `- ${id}（${screen.name ?? id}）：${states.join("、")}`;
  });
  const sizes = [...new Set(round.shots.filter((s) => ids.includes(s.screen))
    .map((s) => `截图 ${s.width}×${s.height} 像素${s.logicalWidth ? `，逻辑宽度 ${s.logicalWidth}` : ""}`))];
  let refs = "无";
  if (refDir) {
    const ref = loadRound(refDir);
    const list = ref.shots.filter((s) => ids.includes(s.screen)).map((s) => `${s.path}  ${s.screen} / ${s.theme} / ${s.state}（${ref.platform}）`);
    if (list.length) refs = list.join("\n");
  }
  const mode = ctx.pending.length ? "calibrate" : "polish";
  const text = fillPrompt(asset(mode === "calibrate" ? "review-calibrate.md" : "review-polish.md"), {
    平台: `${round.platform}（平台族 ${ctx.family}）`,
    送审图片: review.map((s) => `${s.file}  ${s.tiles.map((t) => t.label).join(" | ")}`).join("\n"),
    原图: tiles.map((t) => `${t.path}  ${t.label}`).join("\n"),
    截图说明: [...sizes, ...describe].join("\n"),
    参照图: refs,
    蓝图: ctx.blueprint,
    评分标准: readFileSync(rubric, "utf8").trim(),
    定调界面: ctx.pending.join("、"),
  });
  return { mode, pending: ctx.pending, text };
}

const optJson = (file) => (existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null);

// 网页数据：每格在各轮的截图和分数，各轮的建议、采纳记录和打磨范围草案。图片路径相对网页所在目录。
export function pageData(map, dirs, out, title) {
  const base = dirname(resolve(out));
  const src = (p) => { const r = relative(base, p); return isAbsolute(r) ? pathToFileURL(p).href : r.split(sep).join("/"); };
  const names = (s) => {
    const screen = map.screens.find((x) => x.id === s.screen);
    const state = screen?.states.find((x) => x.id === s.state);
    return `${screen?.name ?? s.screen} / ${s.theme} / ${state?.name ?? s.state}`;
  };
  const warnings = [];
  const rounds = dirs.map((d, i) => {
    const dir = resolve(d);
    const manifest = optJson(join(dir, "manifest.json"));
    if (!manifest) throw new Error(`找不到 ${join(dir, "manifest.json")}`);
    const scores = optJson(join(dir, "scores.json")) ?? [];
    const sugg = optJson(join(dir, "suggestions.json"));
    const changes = optJson(join(dir, "changes.json"));
    if (!scores.length) warnings.push(`${basename(dir)}：没有 scores.json，先运行 merge`);
    const ids = [...(sugg?.suggestions ?? []), ...(sugg?.mismatches ?? [])].map((x) => x.id);
    const answered = new Set([...(changes?.adopted ?? []), ...(changes?.declined ?? [])].map((x) => x.id));
    const missing = ids.filter((id) => !answered.has(id));
    if (i < dirs.length - 1 && missing.length) warnings.push(`${basename(dir)}：changes.json 没有交代 ${missing.join("、")}`);
    return {
      name: basename(dir), platform: manifest.platform, mode: sugg?.mode ?? null,
      shots: manifest.shots.map((s) => {
        const sc = scores.find((x) => key(x) === key(s));
        return { key: key(s), src: src(isAbsolute(s.file) ? s.file : resolve(dir, s.file)), score: sc?.score ?? null, deductions: sc?.deductions ?? [] };
      }),
      suggestions: sugg?.suggestions ?? [], mismatches: sugg?.mismatches ?? [], directions: sugg?.directions ?? [], scope: sugg?.scope ?? null,
      adopted: changes?.adopted ?? [], declined: changes?.declined ?? [],
    };
  });
  const seen = new Map();
  for (const r of rounds) for (const s of r.shots) if (!seen.has(s.key)) {
    const [screen, theme, state] = s.key.split("/");
    seen.set(s.key, { key: s.key, label: names({ screen, theme, state }) });
  }
  return {
    data: { title: title ?? `${rounds[0].platform} 界面打磨`, threshold: map.config.threshold, generatedAt: new Date().toISOString(), cells: [...seen.values()], rounds },
    warnings,
  };
}

export function renderPage(data) {
  return asset("page.html").replace("/*DATA*/null", () => JSON.stringify(data).replace(/</g, "\\u003c"));
}

export function run(argv, log = console.log, build = defaultBuild()) {
  const args = parseArgs(argv, ["help", "fresh"]);
  const [cmd, ...rest] = args._;
  if (!cmd || args.help) { log(USAGE); return 0; }

  if (cmd === "compare") {
    if (rest.length !== 2) throw new Error("compare 需要两个轮次目录");
    const [a, b] = rest.map(loadRound);
    const other = new Map(b.shots.map((s) => [key(s), s]));
    const diff = [];
    let same = 0;
    for (const s of a.shots) {
      const t = other.get(key(s));
      if (!t) diff.push(`${key(s)}：第二轮没有这一格`);
      else if (t.hash !== s.hash) diff.push(`${key(s)}：画面不同（${s.path} ↔ ${t.path}）`);
      else same++;
    }
    log(`${same} 格画面一致，${diff.length} 格不一致。`);
    for (const d of diff) log(`- ${d}`);
    return diff.length ? 1 : 0;
  }

  const dir = resolve(args.dir ?? join(dirname(fileURLToPath(import.meta.url)), ".."));
  const map = loadMap(dir);
  const [roundDir] = rest;
  if (!roundDir) throw new Error(`${cmd} 需要轮次目录`);

  if (cmd === "page") {
    if (!args.out) throw new Error("page 需要 --out <网页.html>");
    const { data, warnings } = pageData(map, rest, args.out, args.title);
    mkdirSync(dirname(resolve(args.out)), { recursive: true });
    writeFileSync(resolve(args.out), renderPage(data));
    log(`已写入 ${resolve(args.out)}：${data.rounds.length} 轮，${data.cells.length} 格。`);
    for (const w of warnings) log(`提示：${w}`);
    return 0;
  }

  if (cmd === "verify" || cmd === "prepare") {
    const round = loadRound(roundDir);
    const errors = verifyRound(map, round);
    if (cmd === "verify" || errors.length) {
      for (const e of errors) log(`错误：${e}`);
      if (!errors.length) log(`截图清单正常：${round.shots.length} 格，平台 ${round.platform}。`);
      return errors.length ? 1 : 0;
    }
    const prev = args.prev ? readJson(join(resolve(args.prev), "scores.json"), "先对上一轮运行 merge") : null;
    const sheets = attachCarry(layout(round, map.config.themes), { platform: round.platform, map, prev, fresh: args.fresh });
    mkdirSync(join(round.dir, "sheets"), { recursive: true });
    for (const s of sheets) {
      s.file = s.standalone ? s.tiles[0].path : join(round.dir, "sheets", `${s.id}.jpg`);
      if (s.review && !s.standalone) build(s, s.file);
    }
    const plan = {
      platform: round.platform, createdAt: new Date().toISOString(),
      sheets: sheets.map((s) => ({ id: s.id, file: s.file, review: s.review,
        tiles: s.tiles.map((t) => ({ screen: t.screen, theme: t.theme, state: t.state, label: t.label, path: t.path, hash: t.hash, ...(t.carry ? { carry: t.carry } : {}) })) })),
    };
    const review = plan.sheets.filter((s) => s.review);
    const prompt = review.length ? buildPrompt(map, round, plan, args.ref) : null;
    if (prompt) Object.assign(plan, { mode: prompt.mode, pending: prompt.pending });
    writeFileSync(join(round.dir, "plan.json"), `${JSON.stringify(plan, null, 2)}\n`);
    const carried = plan.sheets.filter((s) => !s.review).flatMap((s) => s.tiles);
    log(`本轮送审 ${review.length} 张图（${review.reduce((n, s) => n + s.tiles.length, 0)} 格），沿用 ${carried.length} 格的分数。`);
    if (prompt) {
      writeFileSync(join(round.dir, "prompt.md"), prompt.text);
      log(prompt.mode === "calibrate"
        ? `\n定调轮：${prompt.pending.join("、")} 在蓝图里还没有打磨范围，评审员会起草草案，merge 后交给用户确认。`
        : "\n打磨轮：送审界面都有打磨范围。");
      log(`评审提示词：${join(round.dir, "prompt.md")}（全文原样发给评审员）`);
      log("\n送审图片：");
      for (const s of review) log(`${s.file}  ${s.tiles.map((t) => t.label).join(" | ")}`);
    } else log("画面都没有变化，不需要评审，直接运行 merge。");
    if (carried.length) {
      log("\n沿用的分数：");
      for (const t of carried) log(`- ${t.label}：${t.carry.score}（${t.carry.from}）`);
    }
    return 0;
  }

  if (cmd === "merge") {
    const round = resolve(roundDir);
    const plan = readJson(join(round, "plan.json"), "先运行 prepare");
    const needsReview = plan.sheets.some((s) => s.review);
    if (needsReview && !args.review) throw new Error("本轮有送审图片，merge 需要 --review <评审结果.json>");
    const review = args.review ? readJson(resolve(args.review)) : null;
    const { errors, scores, notes } = mergeReview(plan, review);
    if (errors.length) throw new Error(`评审结果不完整，让评审员补齐后再合并：\n${errors.join("\n")}`);
    writeFileSync(join(round, "scores.json"), `${JSON.stringify(scores, null, 2)}\n`);
    const sugg = collectSuggestions(plan, review);
    writeFileSync(join(round, "suggestions.json"), `${JSON.stringify(sugg, null, 2)}\n`);
    for (const n of notes) log(`提示：${n}`);
    const low = scores.filter((s) => s.score < map.config.threshold);
    log(`已写入 ${join(round, "scores.json")}：${scores.length} 格，${low.length} 格低于阈值 ${map.config.threshold}。`);
    for (const id of new Set(scores.map((s) => s.screen))) {
      log(`- ${id}：最低分 ${Math.min(...scores.filter((s) => s.screen === id).map((s) => s.score))}`);
    }
    for (const s of low) log(`  未达标 ${key(s)} ${s.score}：${s.deductions[0] ?? "（无扣分点）"}`);
    log(`\n已写入 ${join(round, "suggestions.json")}：${sugg.suggestions.length} 条修改建议，${sugg.mismatches.length} 处与蓝图不一致，${sugg.directions.length} 条方向性建议。`);
    for (const s of sugg.suggestions) log(`${s.id} ${key(s)} ${formatDeduction(s)} → ${s.suggestion}`);
    for (const m of sugg.mismatches) log(`${m.id} 与蓝图不一致：${m.sheet ? `${m.sheet} ` : ""}${m.text ?? ""}`);
    for (const d of sugg.directions) log(`${d.id} 方向性建议：${d.screen ? `${d.screen} ` : ""}${d.text ?? ""}`);
    if (sugg.mode === "calibrate") log(`\n定调轮：打磨范围草案覆盖 ${sugg.scope.map((s) => s.screen).join("、")}，用 page 生成网页交给用户确认。`);
    return 0;
  }

  throw new Error(`未知命令 ${cmd}\n\n${USAGE}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  try { process.exitCode = run(process.argv.slice(2)); }
  catch (e) { console.error(e.message); process.exitCode = 1; }
}
