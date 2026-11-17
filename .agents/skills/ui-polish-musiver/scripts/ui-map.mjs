#!/usr/bin/env node
// 界面地图：每个界面一个 JSON，记录状态、源码路径与评分；按「未评分 → 未达标 → 已过期」挑下一批。
//
// 用法：node ui-map.mjs <命令> [选项]，--help 查看全部命令。
// 数据目录默认是本脚本所在技能目录（scripts/ 的上一级），可用 --dir 覆盖。

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const USAGE = `用法：node ui-map.mjs <命令> [选项]

命令：
  status [--platform a,b]          各界面的评分覆盖、最低分、过期与截图缺口
  next [--platform a,b] [--count n] 下一批要打磨的界面（默认数量取 config.batchSize），附同平台族的参照平台
  record <界面> --platform p --theme t --state s --score x [--deduction 文本]... [--shot 画面哈希]
  record --from <scores.json>      记录一格（或 ui-shots merge 产出的一批格子）的最终分数，提交号取 HEAD；
                                   相关源码有未提交改动时拒绝
  invalidate [<界面>...] [--blueprint 名字] [--platform a,b] [--theme a,b] [--state a,b] --reason 文本
                                   把指定范围内已有的分数标为过期（如蓝图改了布局，同族其他平台需要重新对齐）
  check [--strict]                 校验地图格式，提示过期格与注册表里未登记的界面
  sync-registry                    为注册表里有、地图里没有的界面生成占位文件
  config [<键> <值>]               查看或修改 threshold / batchSize

通用选项：
  --family a,b                     按平台族筛选，可与 --platform 合用，取并集（status / next / invalidate）
  --dir <技能目录>                 默认是本脚本的上一级目录`;

const RANK = { gap: 0, unscored: 0, low: 1, stale: 2, ok: 3 };
const CONFIG_KEYS = { threshold: (v) => v >= 0 && v <= 10, batchSize: (v) => Number.isInteger(v) && v > 0 };

export function parseArgs(argv, flags = ["strict", "help"]) {
  const out = { _: [], deduction: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) { out._.push(a); continue; }
    const key = a.slice(2);
    if (flags.includes(key)) { out[key] = true; continue; }
    const val = argv[++i];
    if (val === undefined) throw new Error(`选项 --${key} 缺少取值`);
    if (key === "deduction") out.deduction.push(val);
    else out[key] = val;
  }
  return out;
}

export function loadMap(dir) {
  const configPath = join(dir, "config.json");
  if (!existsSync(configPath)) throw new Error(`找不到 ${configPath}`);
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  const screensDir = join(dir, "screens");
  const screens = existsSync(screensDir)
    ? readdirSync(screensDir).filter((f) => f.endsWith(".json")).sort()
        .map((f) => ({ file: join(screensDir, f), ...JSON.parse(readFileSync(join(screensDir, f), "utf8")) }))
    : [];
  return { dir, configPath, config, screens };
}

export function validate(map) {
  const errors = [];
  const { config, screens } = map;
  if (!(config.threshold >= 0 && config.threshold <= 10)) errors.push("config.threshold 须在 0–10 之间");
  if (!(Number.isInteger(config.batchSize) && config.batchSize > 0)) errors.push("config.batchSize 须为正整数");
  if (!Array.isArray(config.platforms) || !config.platforms.length) errors.push("config.platforms 不能为空");
  if (!Array.isArray(config.themes) || !config.themes.length) errors.push("config.themes 不能为空");
  if (!config.families || typeof config.families !== "object") errors.push("config.families 不能为空，把布局相近的平台归为一族");
  else {
    for (const p of config.platforms ?? []) {
      const n = Object.values(config.families).filter((list) => list.includes(p)).length;
      if (n !== 1) errors.push(`平台 ${p} 须恰好属于一个平台族，现在属于 ${n} 个`);
    }
    for (const [fam, list] of Object.entries(config.families)) {
      for (const p of list) if (!(config.platforms ?? []).includes(p)) errors.push(`平台族 ${fam} 里的 ${p} 不在 config.platforms 中`);
    }
  }
  const seen = new Set();
  for (const s of screens) {
    const where = s.file ?? s.id;
    if (!s.id) { errors.push(`${where}：缺 id`); continue; }
    if (seen.has(s.id)) errors.push(`${where}：id ${s.id} 重复`);
    seen.add(s.id);
    if (s.file && !s.file.endsWith(`${s.id}.json`)) errors.push(`${where}：文件名须为 ${s.id}.json`);
    if (!Array.isArray(s.states) || !s.states.length) errors.push(`${where}：states 不能为空，至少有 default`);
    for (const sc of s.scores ?? []) {
      if (!(sc.score >= 0 && sc.score <= 10)) errors.push(`${where}：分数 ${sc.score} 越界`);
      if (!sc.commit) errors.push(`${where}：分数缺 commit`);
    }
  }
  return errors;
}

export function familyOf(config, platform) {
  return Object.entries(config.families ?? {}).find(([, list]) => list.includes(platform))?.[0] ?? platform;
}

export function resolveFilter(config, platforms, families) {
  if (!platforms && !families) return null;
  const out = new Set(platforms ?? []);
  for (const fam of families ?? []) {
    const list = config.families?.[fam];
    if (!list) throw new Error(`没有平台族 ${fam}，可选：${Object.keys(config.families ?? {}).join(" / ")}`);
    list.forEach((p) => out.add(p));
  }
  return [...out];
}

// 同族里这个界面全部格子都已达标且未过期的平台，可作为对齐参照。
export function references(screen, config, changedSince, family) {
  return (config.families?.[family] ?? [])
    .filter((p) => platformsOf(screen, config).includes(p))
    .filter((p) => { const list = cells(screen, config, changedSince, [p]); return list.length && list.every((c) => c.status === "ok"); });
}

export function platformsOf(screen, config) {
  const list = screen.platforms ?? config.platforms;
  return list.filter((p) => !screen.unsupported?.[p]);
}

export function sourcesOf(screen, platform) {
  return [...(screen.sources?.["*"] ?? []), ...(screen.sources?.[platform] ?? [])];
}

const touches = (changed, paths) =>
  paths.some((p) => { const q = p.replace(/\/+$/, ""); return changed.some((f) => f === q || f.startsWith(`${q}/`)); });

// changedSince(commit) 返回该提交之后（含工作区与未跟踪文件）改过的路径；提交不存在时返回 null。
export function cells(screen, config, changedSince, platformFilter) {
  const out = [];
  const themes = screen.themes ?? config.themes;
  for (const platform of platformsOf(screen, config)) {
    if (platformFilter && !platformFilter.includes(platform)) continue;
    for (const theme of themes) {
      for (const state of screen.states ?? []) {
        const cell = { platform, theme, state: state.id };
        const gap = state.gaps?.[platform];
        const score = (screen.scores ?? []).find((x) => x.platform === platform && x.theme === theme && x.state === state.id);
        if (gap) Object.assign(cell, { status: "gap", gap });
        else if (!score) cell.status = "unscored";
        else {
          cell.score = score.score;
          if (score.invalidated) cell.reason = score.invalidated.reason;
          const changed = changedSince(score.commit);
          const stale = Boolean(score.invalidated) || changed === null || touches(changed, sourcesOf(screen, platform));
          cell.status = score.score < config.threshold ? "low" : stale ? "stale" : "ok";
        }
        out.push(cell);
      }
    }
  }
  return out;
}

export function summarize(screen, list) {
  const scores = list.filter((c) => c.score !== undefined).map((c) => c.score);
  const count = (st) => list.filter((c) => c.status === st).length;
  const worst = list.reduce((m, c) => Math.min(m, RANK[c.status]), RANK.ok);
  return {
    id: screen.id, name: screen.name ?? screen.id, priority: screen.priority ?? 2,
    total: list.length, scored: scores.length, min: scores.length ? Math.min(...scores) : null,
    unscored: count("unscored"), gap: count("gap"), low: count("low"), stale: count("stale"), worst,
  };
}

export function rank(summaries) {
  return summaries
    .filter((s) => s.total > 0 && s.worst < RANK.ok)
    .sort((a, b) => a.worst - b.worst || a.priority - b.priority || (a.min ?? -1) - (b.min ?? -1) || a.id.localeCompare(b.id));
}

function git(repo, args) {
  return execFileSync("git", ["-C", repo, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function repoRoot(dir) {
  return realpathSync(git(dir, ["rev-parse", "--show-toplevel"]).trim());
}

export function gitChangedSince(repo) {
  const cache = new Map();
  let untracked;
  return (commit) => {
    if (cache.has(commit)) return cache.get(commit);
    let files = null;
    try {
      git(repo, ["cat-file", "-e", `${commit}^{commit}`]);
      untracked ??= git(repo, ["ls-files", "--others", "--exclude-standard", "--full-name"]).split("\n").filter(Boolean);
      files = [...git(repo, ["diff", "--name-only", commit, "--"]).split("\n").filter(Boolean), ...untracked];
    } catch { files = null; }
    cache.set(commit, files);
    return files;
  };
}

const splitList = (v) => (v ? v.split(",").map((x) => x.trim()).filter(Boolean) : null);
const fmt = (n) => (n === null ? "—" : String(n));

function table(rows) {
  const head = "| 界面 | 优先级 | 已评/总格 | 最低分 | 未评 | 缺截图 | 未达标 | 过期 |";
  const sep = "|---|---|---|---|---|---|---|---|";
  return [head, sep, ...rows.map((r) =>
    `| ${r.id}（${r.name}） | ${r.priority} | ${r.scored}/${r.total} | ${fmt(r.min)} | ${r.unscored} | ${r.gap} | ${r.low} | ${r.stale} |`)].join("\n");
}

function summaries(map, filter) {
  const changed = gitChangedSince(repoRoot(map.dir));
  return map.screens.map((s) => summarize(s, cells(s, map.config, changed, filter)));
}

function writeScreen(screen) {
  const { file, ...data } = screen;
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function registryIds(map) {
  const reg = map.config.registry;
  if (!reg) return null;
  const root = repoRoot(map.dir);
  const data = JSON.parse(readFileSync(resolve(root, reg.file), "utf8"));
  const list = reg.list ? reg.list.split(".").reduce((o, k) => o?.[k], data) : data;
  if (!Array.isArray(list)) throw new Error(`registry.list 在 ${reg.file} 里没有指向数组`);
  return list.map((x) => ({ id: x[reg.id ?? "id"], name: x[reg.name ?? "name"] })).filter((x) => x.id);
}

export function run(argv, log = console.log) {
  const args = parseArgs(argv);
  const [cmd, ...rest] = args._;
  if (!cmd || args.help) { log(USAGE); return 0; }
  const dir = resolve(args.dir ?? join(dirname(fileURLToPath(import.meta.url)), ".."));
  const map = loadMap(dir);
  const errors = validate(map);
  if (errors.length && cmd !== "check") throw new Error(`地图格式有误，先运行 check：\n${errors.join("\n")}`);
  const filter = resolveFilter(map.config, splitList(args.platform), splitList(args.family));

  if (cmd === "status") {
    const rows = summaries(map, filter);
    log(`阈值 ${map.config.threshold}，每批 ${map.config.batchSize} 个界面，共 ${rows.length} 个界面`);
    log(table(rows));
    return 0;
  }

  if (cmd === "next") {
    const count = args.count ? Number(args.count) : map.config.batchSize;
    const picked = rank(summaries(map, filter)).slice(0, count);
    if (!picked.length) { log("没有需要打磨的界面：所选平台的格子都已达标且未过期。"); return 0; }
    const changed = gitChangedSince(repoRoot(map.dir));
    for (const s of picked) {
      const screen = map.screens.find((x) => x.id === s.id);
      log(`\n## ${s.id}（${s.name}）  蓝图：${screen.blueprint ?? "未指定"}`);
      const list = cells(screen, map.config, changed, filter);
      for (const fam of [...new Set(list.map((c) => familyOf(map.config, c.platform)))]) {
        const refs = references(screen, map.config, changed, fam);
        log(`### 平台族 ${fam}  参照：${refs.length ? refs.join("、") : "无"}`);
        for (const c of list.filter((x) => familyOf(map.config, x.platform) === fam)) {
          const extra = c.status === "gap" ? `：${c.gap}` : c.score !== undefined ? ` ${c.score}${c.reason ? `（${c.reason}）` : ""}` : "";
          log(`- ${c.platform} / ${c.theme} / ${c.state}：${c.status}${extra}`);
        }
      }
    }
    return 0;
  }

  if (cmd === "record") {
    const items = args.from
      ? JSON.parse(readFileSync(resolve(args.from), "utf8"))
      : [{ screen: rest[0], platform: args.platform, theme: args.theme, state: args.state, score: Number(args.score), deductions: args.deduction, shot: args.shot }];
    if (!Array.isArray(items) || !items.length) throw new Error(`${args.from} 里没有要记录的格子`);
    const root = repoRoot(map.dir);
    const head = git(root, ["rev-parse", "HEAD"]).trim();
    const date = new Date().toISOString().slice(0, 10);
    const touched = new Set();
    // 先校验全部格子再写盘，批量记录不会只写进一半。
    const entries = items.map((item) => {
      const screen = map.screens.find((s) => s.id === item.screen);
      if (!screen) throw new Error(`地图里没有界面 ${item.screen}`);
      const { platform, theme, state, score } = item;
      if (!platform || !theme || !state || typeof score !== "number" || Number.isNaN(score)) throw new Error("record 需要 --platform --theme --state --score");
      if (!platformsOf(screen, map.config).includes(platform)) throw new Error(`${screen.id} 不支持平台 ${platform}`);
      if (!(screen.themes ?? map.config.themes).includes(theme)) throw new Error(`${screen.id} 没有主题 ${theme}`);
      if (!screen.states.some((s) => s.id === state)) throw new Error(`${screen.id} 没有状态 ${state}`);
      if (!(score >= 0 && score <= 10)) throw new Error("分数须在 0–10 之间");
      const paths = sourcesOf(screen, platform);
      if (!paths.length) throw new Error(`${screen.id} 没有登记 ${platform} 的 sources，无法判断以后是否过期`);
      const dirty = git(root, ["status", "--porcelain", "--", ...paths]).trim();
      if (dirty) throw new Error(`先提交界面改动再记录分数：\n${dirty}`);
      const entry = { platform, theme, state, score, commit: head, date, deductions: item.deductions ?? [], ...(item.shot ? { shot: item.shot } : {}) };
      return { screen, entry };
    });
    for (const { screen, entry } of entries) {
      const { platform, theme, state } = entry;
      screen.scores = [...(screen.scores ?? []).filter((x) => !(x.platform === platform && x.theme === theme && x.state === state)), entry];
      touched.add(screen);
    }
    touched.forEach(writeScreen);
    if (entries.length === 1) {
      const { screen, entry } = entries[0];
      log(`已记录 ${screen.id} ${entry.platform}/${entry.theme}/${entry.state} = ${entry.score}（${head.slice(0, 8)}）`);
    } else log(`已记录 ${entries.length} 格（${touched.size} 个界面，${head.slice(0, 8)}）`);
    return 0;
  }

  if (cmd === "invalidate") {
    if (!args.reason) throw new Error("invalidate 需要 --reason，写明为什么这些格子要重新评分");
    if (!rest.length && !args.blueprint) throw new Error("invalidate 需要界面 id 或 --blueprint");
    for (const id of rest) if (!map.screens.some((s) => s.id === id)) throw new Error(`地图里没有界面 ${id}`);
    const themes = splitList(args.theme);
    const states = splitList(args.state);
    const targets = map.screens.filter((s) => rest.includes(s.id) || (args.blueprint && s.blueprint === args.blueprint));
    if (!targets.length) throw new Error(`没有界面使用蓝图 ${args.blueprint}`);
    const date = new Date().toISOString().slice(0, 10);
    let count = 0;
    for (const s of targets) {
      let touched = false;
      for (const sc of s.scores ?? []) {
        if (filter && !filter.includes(sc.platform)) continue;
        if (themes && !themes.includes(sc.theme)) continue;
        if (states && !states.includes(sc.state)) continue;
        sc.invalidated = { reason: args.reason, date };
        touched = true;
        count++;
      }
      if (touched) writeScreen(s);
    }
    log(`已把 ${targets.length} 个界面中的 ${count} 格标为过期：${args.reason}`);
    return 0;
  }

  if (cmd === "check") {
    const warnings = [];
    for (const s of map.screens) {
      for (const p of platformsOf(s, map.config)) if (!sourcesOf(s, p).length) warnings.push(`${s.id}：缺少 ${p} 的 sources`);
    }
    const ids = registryIds(map);
    if (ids) {
      const known = new Set(map.screens.map((s) => s.id));
      for (const r of ids) if (!known.has(r.id)) warnings.push(`${r.id}：注册表里有，地图里没有（运行 sync-registry）`);
    }
    if (!errors.length) {
      for (const r of summaries(map, null)) if (r.stale) warnings.push(`${r.id}：${r.stale} 格已过期（评分后源码有改动，或被 invalidate 标记）`);
    }
    for (const e of errors) log(`错误：${e}`);
    for (const w of warnings) log(`提示：${w}`);
    if (!errors.length && !warnings.length) log(`界面地图正常：${map.screens.length} 个界面。`);
    return errors.length || (args.strict && warnings.length) ? 1 : 0;
  }

  if (cmd === "sync-registry") {
    const ids = registryIds(map);
    if (!ids) throw new Error("config.registry 未配置");
    const known = new Set(map.screens.map((s) => s.id));
    mkdirSync(join(dir, "screens"), { recursive: true });
    const added = ids.filter((r) => !known.has(r.id));
    for (const r of added) {
      writeScreen({ file: join(dir, "screens", `${r.id}.json`), id: r.id, name: r.name ?? r.id, priority: 2,
        sources: {}, states: [{ id: "default", name: "默认" }], scores: [] });
    }
    log(added.length ? `新增 ${added.length} 个占位界面：${added.map((r) => r.id).join(", ")}` : "注册表与地图一致。");
    return 0;
  }

  if (cmd === "config") {
    const [key, raw] = rest;
    if (!key) { log(JSON.stringify({ threshold: map.config.threshold, batchSize: map.config.batchSize })); return 0; }
    if (!CONFIG_KEYS[key]) throw new Error(`只能修改 ${Object.keys(CONFIG_KEYS).join(" / ")}`);
    const value = Number(raw);
    if (!CONFIG_KEYS[key](value)) throw new Error(`${key} 取值无效：${raw}`);
    const { file, ...config } = { ...map.config, [key]: value };
    writeFileSync(map.configPath, `${JSON.stringify(config, null, 2)}\n`);
    log(`${key} = ${value}`);
    return 0;
  }

  throw new Error(`未知命令 ${cmd}\n\n${USAGE}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  try { process.exitCode = run(process.argv.slice(2)); }
  catch (e) { console.error(e.message); process.exitCode = 1; }
}
