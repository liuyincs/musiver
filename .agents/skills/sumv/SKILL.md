---
name: sumv
description: 版本总结
---

依次执行以下步骤：

1. 检查 `gh` cli 是否可用，是否已登录。如果没有，提示用户并立即退出
2. 使用提问工具询问用户需要总结测试版还是正式版
3. 使用 `gh` 获取 `gitbobobo/musiver` 仓库最近的版本标签，以及同类型的上一个版本标签
4. 获取两个标签之间的**全部**提交历史（见下方「提交历史获取」），依次筛选出可被用户感知的更新内容，隐藏技术细节
5. 完成「发布说明自检」后再输出一份 Github Release 风格的更新内容，用代码块包裹
6. 停下来，询问用户是否需要更新版本文件（不要使用提问工具）。用户同意后，参考 `src/types/releases.ts` 修改 `src/data/releases/stable.json` 或 `src/data/releases/beta.json`

## 提交历史获取

> **关键：** `gh api compare` 默认只返回前 250 条提交。beta 版本区间常有 400+ 条提交，不翻页会漏掉大量用户可见功能（例如桌面歌词曾因此被遗漏）。

### 第一步：确认总量

```bash
gh api "repos/gitbobobo/musiver/compare/<旧标签>...<新标签>" \
  --jq '{total: .total_commits, returned: (.commits|length)}'
```

若 `total > returned`，**必须**使用 `--paginate` 拉取全量。

### 第二步：全量拉取

```bash
gh api "repos/gitbobobo/musiver/compare/<旧标签>...<新标签>" --paginate \
  --jq '.commits[] | "\(.commit.author.date[0:10]) | \(.commit.message | split("\n")[0])"'
```

将输出保存到临时文件或逐段分析，不要只读第一页。

### 第三步：识别 `feat(` 提交

优先关注 `feat(` / `fix(` 且涉及 UI、设置页、播放器的提交；忽略纯 `refactor`/`chore`/`test`/`docs`，除非其改变了用户可见行为。

## 发布说明自检

输出前逐项确认，全部打勾才可定稿：

- [ ] 已确认 `total_commits` 与已分析提交数一致（或已用 `--paginate` 覆盖全量）
- [ ] **五个下载平台**（Android / HarmonyOS / Apple(iOS·macOS·tvOS) / Windows / Web）均已检查，无平台 changelog 为空（Web 尤其容易遗漏）
- [ ] Apple 系（iOS / macOS / tvOS）变更统一写入 `apple` 的 VersionInfo，前缀使用 `.apple.`
- [ ] Windows 的桌面端共享能力用 `desktop.*`
- [ ] 跨端能力使用 `common.*`，平台差异使用对应平台前缀
- [ ] 排除对新功能的问题修复项
- [ ] 未把仅基础设施/测试/E2E 改动写入用户发布说明

## 注意事项

- 修改 `stable.json` 或 `beta.json` 时，更新内容必须支持国际化。即同步修改 `i18n/en/code.json` 和 `i18n/zh-Hans/code.json`，并删除不再使用的 key。
- **严格区分更新内容属于哪些下载平台**（Android / HarmonyOS / Apple / Windows / Web），并为每个平台增加对应 VersionInfo，不得遗漏
- Apple 平台（iOS / macOS / tvOS）共用 JSON 字段 `apple`、同一下载入口与 `.apple.` changelog 前缀
- `beta.json` 旧的 VersionInfo 需要保留，只在原来基础上新增
- 新增的 VersionInfo 下载地址留空，以下情况例外：web 端固定填 `https://web.musiver.cn`
- 用户要求保留已有下载地址时，只更新 `changelogI18nKeys` 与 i18n，不改动 `downloadUrl`

## 平台与 i18n 键命名

| 下载平台 | JSON 字段 | i18n 前缀 |
|------|-----------|-----------|
| Android | `android` | `.android.` |
| HarmonyOS | `harmony` | `.harmony.` |
| iOS / macOS / tvOS | `apple` | `.apple.` |
| Windows | `windows` | `.desktop.` |
| Web | `web` | `.web.` |
| 跨端 | 各平台均引用 | `.common.` |
