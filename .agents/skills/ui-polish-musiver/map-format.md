# 界面地图格式

界面地图由 `config.json` 和 `screens/<id>.json` 组成，读写都用 `scripts/ui-map.mjs`。只有 `record` 和 `config` 不覆盖的字段才手改。每一轮截图的文件格式见文末「截图轮次」。

## config.json

```json
{
  "threshold": 9,
  "batchSize": 3,
  "platforms": [
    "macos", "windows", "linux", "web", "harmony-pc",
    "ios", "android-phone", "harmony-phone",
    "ipados", "android-tablet", "harmony-tablet",
    "tvos", "android-tv",
    "watchos", "wearos", "harmony-watch"
  ],
  "themes": ["light", "dark", "transparent"],
  "families": {
    "desktop": ["macos", "windows", "linux", "web", "harmony-pc"],
    "phone": ["ios", "android-phone", "harmony-phone"],
    "tablet": ["ipados", "android-tablet", "harmony-tablet"],
    "tv": ["tvos", "android-tv"],
    "watch": ["watchos", "wearos", "harmony-watch"]
  },
  "registry": { "file": "path/to/pages.json", "list": "pages", "id": "id", "name": "name" }
}
```

- `threshold`：达标分数，一格低于它就是「未达标」。用户的偏好，用户改口时运行 `ui-map.mjs config threshold <值>`。
- `batchSize`：`next` 每批挑多少个界面，修改方式同上。
- `platforms`：平台和形态维度，iPhone 和 iPad 这类形态不同的设备分开写。取仓库已有的平台命名。
- `themes`：应用支持的全部主题。
- `families`：平台族，把布局应当相近的平台归为一族，每个平台恰好属于一族。蓝图按族写布局，`next` 按族列出参照平台，`status` / `next` / `invalidate` 可用 `--family` 筛选。
- `registry`：可选。仓库已有页面注册表（截图契约、路由表导出的 JSON）时填写，地图以它为页面来源，`check` 提示未登记的界面，`sync-registry` 补占位文件。`list` 是指向数组的点分路径，`id` 和 `name` 是数组元素里的字段名。

## screens/&lt;id&gt;.json

```json
{
  "id": "server-config",
  "name": "服务器配置",
  "priority": 1,
  "blueprint": "server-flow",
  "unsupported": { "tvos": "电视端不提供手动配置", "watchos": "手表端只能从手机同步服务器" },
  "sources": {
    "*": ["core/src/server/config"],
    "android-phone": ["clients/kotlin/ui/server/ServerConfigurationScreen.kt"],
    "ios": ["clients/swift/Features/Server/ServerConfigView.swift"]
  },
  "states": [
    { "id": "default", "name": "空白表单" },
    { "id": "error", "name": "必填校验失败" },
    { "id": "quickconnect", "name": "QuickConnect 模式", "gaps": { "web": "截图工具缺少 QuickConnect 注入" } }
  ],
  "scores": [
    { "platform": "android-phone", "theme": "light", "state": "default", "score": 8.4,
      "commit": "<完整 SHA>", "date": "2026-11-14", "deductions": ["提交按钮与表单左边线不齐 -0.3"], "shot": "<画面哈希>" }
  ]
}
```

- 文件名必须是 `<id>.json`。`id` 与注册表一致，没有注册表时取路由名或组件名。
- `priority`：1 核心路径（首启、主页、播放这类每个用户都会看到的界面），2 常用，3 低频。`next` 同档时先挑数字小的。
- `blueprint`：所属蓝图 `blueprints/<名字>.md`。一组界面共用一张蓝图，例如欢迎、服务器列表、服务器配置共用 `server-flow`。蓝图改动不会自动让分数过期，需要时用 `invalidate` 指定范围。
- `platforms` / `themes`：可选，省略时取 `config.json` 的全集。只在界面真的少于全集时填写。
- `unsupported`：界面在某个平台上不存在，写明原因。
- `sources`：判断评分是否过期的依据。`*` 是各平台共用的路径（共享组件、主题 token、核心层视图模型），其余按平台写。写文件或目录，目录覆盖其下全部文件。宁可多写共享样式目录，也要让改动这个界面的提交命中它。
- `states`：界面所有可见状态，至少有 `default`。`gaps` 记录某平台暂时截不到这个状态的原因；补好截图入口后删掉对应条目。
- `scores`：每个 平台 × 主题 × 状态 一格，只保留最后一次。由 `record` 写入，`commit` 是评分时的 HEAD，`deductions` 是评审员给的主要扣分点，`shot` 是评分时那张截图的画面哈希（见「截图轮次」）。`invalidated` 由 `invalidate` 写入，记录被标为过期的原因和日期；重新 `record` 这一格时清除。

## 格子状态

| 状态 | 含义 | `next` 顺序 |
|---|---|---|
| `unscored` | 从没评过分 | 1 |
| `gap` | 截不到这个状态 | 1，先补截图入口 |
| `low` | 分数低于阈值 | 2 |
| `stale` | 评分提交之后 `sources` 有改动（含未提交改动），或被 `invalidate` 标记 | 3 |
| `ok` | 达标且未过期 | 不挑 |

一个界面按它最差的格子归档，同档再按 `priority`、最低分排序。

## 截图轮次

一轮截图放在仓库外的一个目录里，由 `scripts/ui-shots.mjs` 读写。截图工具负责写图片和 `manifest.json`，其余文件由 `ui-shots` 生成：

```json
{
  "platform": "android-phone",
  "logicalWidth": 360,
  "ignore": [{ "height": 96 }],
  "shots": [
    { "screen": "home", "theme": "dark", "state": "empty", "file": "home-dark-empty.png" },
    { "screen": "home", "theme": "dark", "state": "long", "file": "home-dark-long.png", "logicalWidth": 412 },
    { "screen": "player", "theme": "dark", "state": "default", "file": "player-dark-default.png",
      "ignore": [{ "x": 48, "y": 1820, "width": 160, "height": 52 }] }
  ]
}
```

- `platform`：一轮只截一个平台。
- `logicalWidth`：设备的逻辑宽度（dp、pt 或 CSS 像素）。拼图把每格缩到这个宽度；单条 shot 可以覆盖。省略时按原图宽度。
- `ignore`：算画面哈希时跳过的易变区域，单位是图片像素。省略 `x` / `y` 从 0 开始，省略 `width` / `height` 延伸到图片边缘，所以 `{ "height": 96 }` 就是顶部 96px 高的状态栏。顶层的对整轮生效，单条 shot 的再叠加上去。只支持 PNG。
- `shots`：`screen`、`theme`、`state` 与地图一致，`file` 相对本目录或写绝对路径。出现在这里的界面，要把它在本平台上除 `gaps` 以外的格子全部截齐，`verify` 按这条检查。
- `plan.json`：`prepare` 写入，记录拼图、每格的画面哈希、沿用的分数、轮次类型（`mode`：`calibrate` 定调轮 / `polish` 打磨轮）和待定调的界面。
- `sheets/`：`prepare` 生成的拼图。
- `prompt.md`：`prepare` 用 `assets/` 里的模板、蓝图和 `rubric.md` 生成的评审提示词，全文原样发给评审员。
- `review.json`：评审员回复的 JSON，格式写在 `prompt.md` 末尾，原样保存。
- `scores.json`：`merge` 写入，`ui-map record --from` 读取，也是下一轮 `prepare --prev` 沿用分数的来源。
- `suggestions.json`：`merge` 写入，把修改建议编号为 `S1…`、与蓝图不一致编号为 `M1…`、方向性建议编号为 `D1…`；定调轮另带 `scope`，即评审员起草的打磨范围。
- `changes.json`：代理写入，逐条交代这一轮的 `S`、`M` 采纳了哪些、改了什么，没采纳的写明原因（格式见 `SKILL.md`「打磨一批」）。`page` 用它生成过程记录。

画面哈希：PNG 取尺寸、调色板和还原后的像素，`ignore` 区域清零后再算，换一种压缩方式编码也不影响；其他格式取文件字节。同一构建连拍两轮，`compare` 应当全部一致，否则沿用分数不会生效。
